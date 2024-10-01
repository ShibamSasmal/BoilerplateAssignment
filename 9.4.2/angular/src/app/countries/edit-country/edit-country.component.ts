import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CountryServiceProxy,
  CountryDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './edit-country.component.html'
})
export class EditCountryDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  country: CountryDto = new CountryDto(); // Initialize CountryDto
  id: number; // Country ID will be passed to this component

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // Ensure the ID is valid before fetching the country details
    if (this.id && this.id > 0) {
      this._countryService.get(this.id).subscribe(
        (result) => {
          this.country = result; // Assign the fetched country data
          this.cd.detectChanges(); // Trigger change detection after data is loaded
        },
        (error) => {
          this.notify.error(this.l('CouldNotLoadCountry')); // Handle error
        }
      );
    } else {
      this.notify.warn(this.l('InvalidCountryId')); // Notify if the ID is invalid
      this.bsModalRef.hide(); // Close the modal if no valid ID is provided
    }
  }

  save(): void {
    this.saving = true;

    this._countryService.update(this.country).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide(); // Close modal after successful save
        this.onSave.emit(); // Emit the save event
      },
      (error) => {
        this.saving = false; // Reset saving status on error
        this.notify.error(this.l('CouldNotSaveCountry')); // Handle save error
      }
    );
  }
}
