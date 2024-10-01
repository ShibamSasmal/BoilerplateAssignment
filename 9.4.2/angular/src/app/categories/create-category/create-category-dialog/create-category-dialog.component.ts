import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CategoryServiceProxy,
  CategoryDto,
  CreateCategoryDto,
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'create-category-dialog.component.html',
})
export class CreateCategoryDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  category = new CategoryDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private _categoryService: CategoryServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    // Initialize the isActive property
    this.category.isActive = true; 
    console.log('isActive during initialization:', this.category.isActive);
  }

  ngAfterViewInit(): void {
    // Recheck after view is initialized
    this.category.isActive = true; 
    console.log('isActive after view init:', this.category.isActive);
    this.cd.detectChanges(); // Ensure view is updated
  }

  save(): void {
    this.saving = true;

    const category = new CreateCategoryDto();
    category.init(this.category);

    console.log('isActive before saving:', this.category.isActive); // Log the value

    this._categoryService.create(category).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit(null);
      },
      () => {
        this.saving = false;
        this.cd.markForCheck(); // Alternative to detectChanges
      }
    );
  }

  onIsActiveChange() {
    this.cd.detectChanges(); 
    console.log('isActive after manual change:', this.category.isActive); // Log the current state
  }
}
