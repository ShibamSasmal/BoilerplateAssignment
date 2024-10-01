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
  CategoryServiceProxy,
  CategoryDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: './edit-category-dialog.component.html'
})
export class EditCategoryDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  category: CategoryDto = new CategoryDto(); // Initialize CategoryDto

  id: number; // Category ID will be passed to this component

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _categoryService: CategoryServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }
  ngOnInit(): void {
    if (this.id && this.id > 0) {
        this._categoryService.get(this.id).subscribe(
            (result: CategoryDto) => {  // Specify the type here
                this.category = result; 
                this.cd.detectChanges(); 
            },
            (error) => {
                this.notify.error(this.l('CouldNotLoadCategory'));
            }
        );
    } else {
        this.notify.warn(this.l('InvalidCategoryId'));
        this.bsModalRef.hide();
    }
}

  // ngOnInit(): void {
  //   // Ensure the ID is valid before fetching the category details
  //   if (this.id && this.id > 0) {
  //     this._categoryService.get(this.id).subscribe(
  //       (result) => {
  //         this.category = result; // Assign the fetched category data
  //         this.cd.detectChanges(); // Trigger change detection after data is loaded
  //       },
  //       (error) => {
  //         this.notify.error(this.l('CouldNotLoadCategory')); // Handle error
  //       }
  //     );
  //   } else {
  //     this.notify.warn(this.l('InvalidCategoryId')); // Notify if the ID is invalid
  //     this.bsModalRef.hide(); // Close the modal if no valid ID is provided
  //   }
  // }

  save(): void {
    this.saving = true;

    this._categoryService.update(this.category).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide(); // Close modal after successful save
        this.onSave.emit(); // Emit the save event
      },
      (error) => {
        this.saving = false; // Reset saving status on error
        this.notify.error(this.l('CouldNotSaveCategory')); // Handle save error
      }
    );
  }
}
