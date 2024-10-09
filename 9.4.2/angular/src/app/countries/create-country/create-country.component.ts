import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryServiceProxy, CreateCountryDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';

@Component({
  templateUrl: './create-country.component.html'
})
export class CreateCountryDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  country = new CreateCountryDto();
  @Output() onSave = new EventEmitter<any>();

  createCountryForm: FormGroup;

  constructor(
    injector: Injector,
    public _countryService: CountryServiceProxy,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.country = this.country || new CreateCountryDto(); 

    this.createCountryForm = this.fb.group({
      name: [this.country.countryName || '', [Validators.required, Validators.maxLength(32)]],
      code: [this.country.countryCode || '', [Validators.required, Validators.maxLength(3)]],
      isActive: [this.country.isActive || false], // Default to false if not provided
    });
  
    // If you expect the country object to be filled with data
    this.createCountryForm.patchValue({
      name: this.country.countryName,
      code: this.country.countryCode,
      isActive: this.country.isActive
    });
  }
  
  save(): void {
    if (this.createCountryForm.invalid) {
      return; // If form is invalid, stop submission
    }
  
    this.saving = true;
  
    // Map the form values to the CreateCountryDto
    this.country.countryName = this.createCountryForm.get('name')?.value; 
    this.country.countryCode = this.createCountryForm.get('code')?.value; 
    this.country.isActive = this.createCountryForm.get('isActive')?.value; 
  
    this._countryService.create(this.country).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit(); // Emit save event
      },
      () => {
        this.saving = false;
      }
    );
  }
  closeForm() {
    this.bsModalRef.hide(); // Close the modal
    this.createCountryForm.reset(); // Optionally reset the form
  }
}
