import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { 
  CategoryServiceProxy, 
  LinkServiceProxy, 
  CreateLinkDto, 
  CountryServiceProxy, 
  FileServiceProxy,  
  FileParameter, 
  FaviconServiceServiceProxy,
  UserAndLinkMappingServiceProxy,
  CreateUserAndLinkMappingDto,
  LinkDto
} from '@shared/service-proxies/service-proxies';
import { finalize, switchMap } from 'rxjs/operators';
import { AbpSessionService } from 'abp-ng2-module';
import 'hammerjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.css'],
})
export class AddLinkComponent implements OnInit {
  linkName = '';
  url = '';
  isActive = true;
  categoryId: number | null = null; 
  countries: number[] = [];
  order: number = 0;
  faviconUrl: string | null = null;
  imageChangedEvent: any = '';
  image: string | null = null;
  imagePath: string | null = null; 
  categories: any[] = [];
  countriesList: any[] = [];
  saving = false;

  @Output() onSave = new EventEmitter<void>();

  constructor(
    public bsModalRef: BsModalRef,
    private _categoryService: CategoryServiceProxy,
    private _linkService: LinkServiceProxy,
    private _countriesService: CountryServiceProxy,
    private fileAppService: FileServiceProxy,
    private favIconService: FaviconServiceServiceProxy, 
    private _userAndLinkMappingService: UserAndLinkMappingServiceProxy, 
    private abpSession: AbpSessionService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadCountries();
  }

  private loadCategories() {
    this._categoryService.getAll('', 0, 100).subscribe(
      (result) => {
        if (result && result.items) {
          this.categories = result.items.map((category) => ({
            label: category.name,
            value: category.id, 
          }));
          this.cdr.detectChanges();
        }
      },
      (error) => {
        abp.notify.error('Failed to load categories');
      }
    );
  }

  private loadCountries() {
    this._countriesService.getAll('', 0, 100).subscribe(
      (result) => {
        this.countriesList = result.items.map((country) => ({
          label: country.countryName,
          value: country.id,
        }));
        this.cdr.detectChanges();
      },
      (error) => {
        abp.notify.error('Failed to load countries');
      }
    );
  }

  onUrlFocusOut(): void {
    if (this.url) {
      this.getFavicon(this.url);
    }
  }

  private getFavicon(url: string): void {
    try {
      const uri = new URL(url);
      const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${uri.host}`;
      this.faviconUrl = faviconUrl;
      this.image = null; // Reset image if favicon is loaded
      this.imageChangedEvent = '';
    } catch (error) {
      this.faviconUrl = null;
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.faviconUrl = null; // Reset favicon if a new image is selected
  }

  imageCropped(event: any): void {
    this.image = event.base64; // Store cropped image
    this.cdr.detectChanges();
  }

  submit(form): void {
    if (form.invalid) {
        console.log('Form is invalid:', form);
        return;
    }

    if (!this.categoryId) {
        abp.notify.error('Please select a category.');
        return;
    }

    this.saving = true;

    // Fetch links for the selected category
    this._linkService.getAll('', 0, 100).subscribe( 
        (links) => {
            let maxOrder = 0;

            if (links && links.items && links.items.length > 0) {
                maxOrder = Math.max(...links.items.map(link => link.order)); 
            }

            const createLinkDto = new CreateLinkDto();
            createLinkDto.linkName = this.linkName;
            createLinkDto.url = this.url;
            createLinkDto.categoryId = this.categoryId;
            createLinkDto.isActive = this.isActive;
            createLinkDto.order = maxOrder + 1;
            createLinkDto.countries = this.countries;
            createLinkDto.imagePath = this.imagePath;

            // Create the link and download favicon in parallel
            this._linkService.create(createLinkDto)
                .pipe(
                    finalize(() => { this.saving = false; }),
                    switchMap(linkDto => {
                        const linkId = linkDto.id;
                        const userId = this.abpSession.userId;

                        const userLinkMapping = new CreateUserAndLinkMappingDto();
                        userLinkMapping.userId = userId;
                        userLinkMapping.linkId = linkId;
                        userLinkMapping.categoryId = this.categoryId;
                        userLinkMapping.isActive = true;

                        // Download favicon and save mappings in parallel
                        return forkJoin([
                            this.favIconService.downloadFavicon(createLinkDto.url),
                            this._userAndLinkMappingService.saveMappings([userLinkMapping])
                        ]);
                    })
                )
                .subscribe(
                    () => {
                        abp.notify.success('Link and user mapping created successfully');
                        this.onSave.emit();
                        this.bsModalRef.hide();
                    },
                    (error) => {
                        console.error('Error during submission process', error);
                        abp.notify.error('Failed to complete the operation');
                    }
                );
        },
        (error) => {
            console.error('Error fetching links by category', error);
            abp.notify.error('Failed to fetch links');
            this.saving = false;
        }
    );
}

// refresh(): void {
//   this.loadCategories(); // Reload categories and links
// }


  

  onImageUpload(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const fileParameter: FileParameter = {
        data: file,
        fileName: file.name,
      };

      this.fileAppService.uploadImage(fileParameter).subscribe(
        (response: string) => {
          this.imagePath = response; 
          abp.notify.success('Image uploaded successfully');
        },
        (error) => {
          abp.notify.error('Failed to upload image');
        }
      );
    }
  }

  onCancel(): void {
    this.bsModalRef.hide();
  }
}
