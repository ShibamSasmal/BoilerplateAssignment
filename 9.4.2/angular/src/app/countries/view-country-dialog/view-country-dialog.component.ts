import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectorRef 
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CountryServiceProxy, LinkDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'view-country-dialog',
  templateUrl: './view-country-dialog.component.html'
})
export class ViewCountryDialogComponent implements OnInit {
  @Input() countryId: number; // Input property for country ID
  @Output() onClose: EventEmitter<void> = new EventEmitter(); // Output EventEmitter for closing
  @Output() errorOccurred: EventEmitter<any> = new EventEmitter(); // Output EventEmitter for errors

  countryName: string;
  links: LinkDto[] = []; // Array to hold links
  isLoading = true; // Loading state

  constructor(
    private _countryService: CountryServiceProxy,
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.countryId !== undefined) {
      this.getLinksByCountryId(this.countryId);
    } else {
      console.error('Country ID is undefined');
      this.isLoading = false; // Stop loading if countryId is not provided
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  getLinksByCountryId(countryId: number): void {
    this.isLoading = true;
    this._countryService.getAllLinksByCountryId(countryId)
      .subscribe(
        (result: LinkDto[]) => {
          console.log('Fetched links:', result); // Log the fetched links
          this.links = result;
          this.isLoading = false; // Set loading to false once data is fetched
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          this.isLoading = false; // Stop loading in case of error
          console.error('Error fetching links:', error);
          this.errorOccurred.emit(error);
          this.cdr.detectChanges(); // Trigger change detection
        }
      );
  }

  close(): void {
    this.onClose.emit(); // Emit the close event
    this.bsModalRef.hide(); // Hide the modal
  }
}
