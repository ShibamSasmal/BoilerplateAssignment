import { 
  Component, 
  OnInit, 
  Output, 
  EventEmitter, 
  ChangeDetectorRef 
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryServiceProxy, LinkServiceProxy, CreateLinkDto, CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-link-dialog',
  templateUrl: './create-links-dialog.component.html',
  styleUrls: ['./create-links-dialog.component.css']
})
export class CreateLinkDialogComponent implements OnInit {
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

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public bsModalRef: BsModalRef,
    private _categoryService: CategoryServiceProxy,
    private _linkService: LinkServiceProxy,
    private _countriesService: CountryServiceProxy,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCountries();
  }

  private loadCategories() {
    this._categoryService.getAll('', 0, 100).subscribe(
      result => {
        console.log('Categories API Response:', result);
        
        if (result && result.items) {
          this.categories = result.items.map(category => ({
            label: category.name,
            value: category.id
          }));
          this.cdr.detectChanges();
        } else {
          console.warn('No categories found in the response.');
        }
      },
      error => {
        console.error('Error fetching categories', error);
        abp.notify.error('Failed to load categories');
      }
    );
  }

  private loadCountries() {
    this._countriesService.getAll('', 0, 100).subscribe(
      result => {
        this.countriesList = result.items.map(country => ({
          label: country.countryName,
          value: country.id
        }));
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching countries', error);
        abp.notify.error('Failed to load countries');
      }
    );
  }

  submit(form): void {
    if (form.invalid) {
      console.log('Form is invalid:', form);
      return;
    }

    this.saving = true;
    const createLinkDto = new CreateLinkDto();
    createLinkDto.linkName = this.linkName;
    createLinkDto.url = this.url;
    createLinkDto.isActive = this.isActive;
    createLinkDto.categoryId = this.categoryId;
    createLinkDto.countries = this.countries;
    createLinkDto.order = this.order;
    createLinkDto.imagePath = this.imagePath; 
   
    console.log('Creating link with DTO:', createLinkDto);

    this._linkService.create(createLinkDto)
      .pipe(finalize(() => {
        this.saving = false;
      }))
      .subscribe(
        () => {
          abp.notify.success('Link created successfully');
          this.onSave.emit(); // Triggers the parent component to refresh the list
          this.bsModalRef.hide(); // Closes the modal
        },
        error => {
          console.error('Error creating link', error);
          if (error.error && error.error.validationErrors) {
            console.error('Validation errors:', error.error.validationErrors);
          }
          abp.notify.error('Failed to create link');
        }
      );
  }
}
