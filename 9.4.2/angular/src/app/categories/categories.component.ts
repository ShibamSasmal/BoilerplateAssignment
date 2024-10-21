import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  CategoryServiceProxy,
  CategoryDto,
  CategoryDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateCategoryDialogComponent } from './create-category/create-category-dialog/create-category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category/edit-category-dialog/edit-category-dialog.component';
import {ViewCategoryDialogComponent} from './view-category-dialog/view-category-dialog.component';
class PagedCategoriesRequestDto extends PagedRequestDto {
  keyword: string = '';  // Default value to avoid undefined issues
  sorting: string | undefined;  // Added sorting property
}

@Component({
  templateUrl: './categories.component.html',
  animations: [appModuleAnimation()]
})
export class CategoriesComponent extends PagedListingComponentBase<CategoryDto> {
  categories: CategoryDto[] = [];
  keyword = ''; // keyword for searching
  maxResultCount: number = 10; // Set a default value for the maximum results per page
  isActive: boolean | undefined; 
  isFilterOpen: boolean = false; 
  

  constructor(
    injector: Injector,
    private _categoryService: CategoryServiceProxy,
    private _modalService: BsModalService,
    cd: ChangeDetectorRef
  ) {
    super(injector, cd);
  }
  toggleIsActiveFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  viewLinks(categoryId: number, name: string): void {
    const modalRef: BsModalRef = this._modalService.show(
      ViewCategoryDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          categoryId: categoryId,
          name: name
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
    request: PagedCategoriesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    this._categoryService
      .getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CategoryDtoPagedResultDto) => {
        // Apply filtering based on the keyword after fetching the data
        this.categories = result.items.filter(category => 
          category.name.toLowerCase().includes(this.keyword.toLowerCase())
        );
        this.showPaging(result, pageNumber);
        this.cd.detectChanges();
      }, (error) => {
        console.error('Error fetching categories:', error);
      });
  }

  getDataPage(pageNumber: number): void {
    const request = new PagedCategoriesRequestDto();
    request.skipCount = (pageNumber - 1) * this.maxResultCount;
    request.maxResultCount = this.maxResultCount;
    request.sorting = ''; // Set sorting to default or whatever logic you want

    this.list(request, pageNumber, () => {
      // Optionally handle completion logic
    });
  }

  delete(category: CategoryDto): void {
    abp.message.confirm(
      this.l('CategoryDeleteWarningMessage', category.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._categoryService
            .delete(category.id)
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

  createCategory(): void {
    this.showCreateOrEditCategoryDialog();
  }

  editCategory(category: CategoryDto): void {
    this.showCreateOrEditCategoryDialog(category.id);
  }

  showCreateOrEditCategoryDialog(id?: number): void {
    let createOrEditCategoryDialog: BsModalRef;
    if (!id) {
      createOrEditCategoryDialog = this._modalService.show(
        CreateCategoryDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditCategoryDialog = this._modalService.show(
        EditCategoryDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditCategoryDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  // Call this method on input change or button click for searching
  searchCategories(): void {
    this.getDataPage(1); // Get the first page of results
  }
}
