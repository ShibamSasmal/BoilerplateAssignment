import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { 
  CategoryServiceProxy, 
  LinkServiceProxy, 
  LinkDto, 
  CountryServiceProxy, 
  FileServiceProxy, 
  FileParameter
} from '@shared/service-proxies/service-proxies';
import { finalize, tap, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-link-dialog',
  templateUrl: './edit-links-dialog.component.html',
  styleUrls: ['./edit-links-dialog.component.css']
})
export class EditLinkDialogComponent implements OnInit {
  serverRootAddress: string = 'https://localhost:44311/';
  @Input() linkId: number; 
  linkName = '';
  url = '';
  isActive = true;
  categoryId: number | null = null;
  countries: number[] = [];
  order: number = 0;
  imagePath = '';
  categories: any[] = [];
  countriesList: any[] = [];
  saving = false;
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public bsModalRef: BsModalRef,
    private _categoryService: CategoryServiceProxy,
    private _linkService: LinkServiceProxy,
    private _countriesService: CountryServiceProxy,
    private cdr: ChangeDetectorRef,
    private fileAppService: FileServiceProxy,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load categories and countries in parallel before loading link details
    forkJoin([
      this.loadCategories(),
      this.loadCountries()
    ]).subscribe({
      next: () => {
        this.loadLinkDetails();
      },
      error: (error) => {
        console.error('Error loading categories or countries:', error);
        abp.notify.error('Failed to load categories or countries');
      }
    });
  }

  private loadCategories() {
    return this._categoryService.getAll('', 0, 100).pipe(
      tap(result => {
        if (result && result.items) {
          this.categories = result.items.map(category => ({
            label: category.name,
            value: category.id
          }));
          console.log('Categories loaded:', this.categories); 
        } else {
          console.warn('No categories found in the response.');
        }
      }),
      catchError(error => {
        console.error('Error fetching categories', error);
        abp.notify.error('Failed to load categories');
        return of(null); // Continue even if categories fail to load
      })
    );
  }

  private loadCountries() {
    return this._countriesService.getAll('', 0, 100).pipe(
      tap(result => {
        if (result && result.items) {
          this.countriesList = result.items.map(country => ({
            label: country.countryName,
            value: country.id
          }));
          console.log('Countries loaded:', this.countriesList); 
        } else {
          console.warn('No countries found in the response.');
        }
      }),
      catchError(error => {
        console.error('Error fetching countries', error);
        abp.notify.error('Failed to load countries');
        return of(null); // Continue even if countries fail to load
      })
    );
  }

  private loadLinkDetails() {
    this._linkService.get(this.linkId).subscribe(
      (result: LinkDto) => {
        if (result) {
          console.log('Link Details:', result); // Debugging
          this.linkName = result.linkName;
          this.url = result.url;
          this.isActive = result.isActive;
          this.categoryId = result.categoryId;
          this.countries = result.countries || []; // Selected country IDs
          this.order = result.order;
          this.imagePath = result.imagePath;

          // Optional: If you have CountryNames, you can use them here
          if (result.countryNames && result.countryNames.length > 0) {
            console.log('Country Names:', result.countryNames); // Debugging
          }

          this.cdr.detectChanges();
        }
      },
      error => {
        console.error('Error fetching link details', error);
        abp.notify.error('Failed to load link details');
      }
    );
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      console.log('Selected file:', this.selectedFile); // Debugging

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result;
        this.cdr.detectChanges(); // Update the view
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  /**
   * Clears the selected image, reverting the preview to the original image or placeholder.
   */
  clearImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    // Optionally, you can also reset the file input element if needed
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.cdr.detectChanges(); // Update the view
    console.log('Image selection cleared'); // Debugging
  }

  submit(form): void {
    if (form.invalid) {
      console.log('Form is invalid:', form);
      return;
    }

    this.saving = true;

    // Create a FileParameter from the selected File
    const fileParam: FileParameter | undefined = this.selectedFile
      ? { data: this.selectedFile, fileName: this.selectedFile.name }
      : undefined;

    // Handle image upload if a new image is selected
    const uploadImage$ = fileParam
      ? this.fileAppService.uploadImage(fileParam).pipe(
          catchError(error => {
            console.error('Error uploading image', error);
            abp.notify.error('Failed to upload image');
            return of(null); // Continue even if image upload fails
          })
        )
      : of(null);

    uploadImage$
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe((imagePath: string | null) => {
        if (imagePath) {
          this.imagePath = imagePath; // Update imagePath with the new path
        }

        // Create an instance of LinkDto
        const linkDto = new LinkDto();
        linkDto.id = this.linkId;
        linkDto.linkName = this.linkName;
        linkDto.imagePath = this.imagePath;
        linkDto.url = this.url;
        linkDto.isActive = this.isActive;
        linkDto.order = this.order;
        linkDto.categoryId = this.categoryId;
        linkDto.countries = this.countries;
        linkDto.categoryName = ''; 

        console.log('Updating link with DTO:', linkDto); 

        this._linkService.update(linkDto) // Call the updated service proxy method
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(
            () => {
              abp.notify.success('Link updated successfully');
              this.onSave.emit();
              this.bsModalRef.hide();
            },
            error => {
              console.error('Error updating link', error);
              if (error.error && error.error.validationErrors) {
                console.error('Validation errors:', error.error.validationErrors);
              }
              abp.notify.error('Failed to update link');
            }
          );
      });
  }
}
