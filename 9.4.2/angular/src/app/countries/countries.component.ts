import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  CountryServiceProxy,
  CountryDto,
  CountryDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateCountryDialogComponent } from './create-country/create-country.component';
import { EditCountryDialogComponent } from './edit-country/edit-country.component';
import { ViewCountryDialogComponent } from './view-country-dialog/view-country-dialog.component';
class PagedCountriesRequestDto extends PagedRequestDto {
  keyword: string = '';  // Default value to avoid undefined issues
  sorting: string | undefined;  // Added sorting property
}

@Component({
  templateUrl: './countries.component.html',
  styleUrls:['./countries.component.css'],
  animations: [appModuleAnimation()]
})
export class CountriesComponent extends PagedListingComponentBase<CountryDto> {
  countries: CountryDto[] = [];
  keyword = ''; // keyword for searching
  maxResultCount: number = 10; // Set a default value for the maximum results per page


  constructor(
    injector: Injector,
    private _countryService: CountryServiceProxy,
    private _modalService: BsModalService,
    cd: ChangeDetectorRef
  ) {
    super(injector, cd);
  }
 
  

  viewLinks(countryId: number, countryName: string): void {
    const modalRef: BsModalRef = this._modalService.show(
      ViewCountryDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          countryId: countryId,
          countryName: countryName
        }
      }
    );

    // Subscribe to the onClose EventEmitter
    modalRef.content.onClose.subscribe(() => {
      this.refresh();  // Refresh the country list after closing the modal
    });

    // Subscribe to the errorOccurred EventEmitter
    modalRef.content.errorOccurred.subscribe((error: any) => {
      console.error('Error in modal:', error);
      // Optionally, display an error notification to the user
      abp.notify.error('An error occurred while fetching links.');
    });
  }
  

  list(
    request: PagedCountriesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    this._countryService
      .getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CountryDtoPagedResultDto) => {
        // Apply filtering based on the keyword after fetching the data
        this.countries = result.items.filter(country => 
          country.countryName.toLowerCase().includes(this.keyword.toLowerCase())
        );
        this.showPaging(result, pageNumber);
        this.cd.detectChanges();
      }, (error) => {
        console.error('Error fetching countries:', error);
      });
  }

  getDataPage(pageNumber: number): void {
    const request = new PagedCountriesRequestDto();
    request.skipCount = (pageNumber - 1) * this.maxResultCount;
    request.maxResultCount = this.maxResultCount;
    request.sorting = ''; // Set sorting to default or whatever logic you want

    this.list(request, pageNumber, () => {
      // Optionally handle completion logic
    });
  }

  delete(country: CountryDto): void {
    abp.message.confirm(
      this.l('CountryDeleteWarningMessage', country.countryName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._countryService
            .delete(country.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createCountry(): void {
    this.showCreateOrEditCountryDialog();
  }

  editCountry(country: CountryDto): void {
    this.showCreateOrEditCountryDialog(country.id);
  }

  showCreateOrEditCountryDialog(id?: number): void {
    let createOrEditCountryDialog: BsModalRef;
    if (!id) {
      createOrEditCountryDialog = this._modalService.show(
        CreateCountryDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditCountryDialog = this._modalService.show(
        EditCountryDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditCountryDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  // Call this method on input change or button click for searching
  searchCountries(): void {
    this.getDataPage(1); // Get the first page of results
  }

  //show the default image if the country flag fetch issue
  flagError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/placeholder.png'; 
  }
}
