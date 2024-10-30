import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { LinkServiceProxy, LinkDto, LinkDtoPagedResultDto } from '@shared/service-proxies/service-proxies';
import { EditLinkDialogComponent } from './edit-links/edit-links-dialog/edit-links-dialog.component';
import { CreateLinkDialogComponent } from './create-links/create-links-dialog/create-links-dialog.component';

class PagedLinksRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | undefined;
}

@Component({
  templateUrl: './links.component.html',
  animations: [appModuleAnimation()],
})
export class LinksComponent extends PagedListingComponentBase<LinkDto> {
  serverRootAddress: string = 'https://localhost:44311/';
  links: LinkDto[] = [];
  keyword = '';
  isActive: boolean | undefined; 
  isFilterOpen = false;

  pageNumber: number = 1;
  totalItems: number = 0;
  maxResultCount: number = 10;

  constructor(
    injector: Injector,
    private _linkService: LinkServiceProxy,
    private _modalService: BsModalService,
    cd: ChangeDetectorRef
  ) {
    super(injector, cd);
  }

  // Fetches the list of links
  list(request: PagedLinksRequestDto, pageNumber: number, finishedCallback: Function): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    request.skipCount = (pageNumber - 1) * request.maxResultCount;

    this._linkService
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: LinkDtoPagedResultDto) => {
        this.links = result.items;
        this.totalItems = result.totalCount;
        this.cd.detectChanges();
      });
  }

  // Toggle the IsActive filter visibility
  toggleIsActiveFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  // Delete a specific link after confirmation
  delete(link: LinkDto): void {
    abp.message.confirm(
      this.l('LinkDeleteWarningMessage', link.linkName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._linkService.delete(link.id).pipe(
            finalize(() => {
              abp.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            })
          ).subscribe(() => {});
        }
      }
    );
  }

  // Open the modal to create a new link
  createLink(): void {
    this.showCreateOrEditLinkDialog();
  }

  // Open the modal to edit an existing link
  editLink(link: LinkDto): void {
    this.showCreateOrEditLinkDialog(link.id);
  }

  // Open a modal to either create or edit a link
  showCreateOrEditLinkDialog(id?: number): void {
    let createOrEditLinkDialog: BsModalRef;
    if (!id) {
      createOrEditLinkDialog = this._modalService.show(CreateLinkDialogComponent, {
        class: 'modal-lg',
      });
    } else {
      createOrEditLinkDialog = this._modalService.show(EditLinkDialogComponent, {
        class: 'modal-lg',
        initialState: {
          linkId: id,
        },
      });
    }

    createOrEditLinkDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  
  searchLinks(): void {
    this.pageNumber = 1; 
    this.refresh(); 
  }

  // Fetch data for the given page
  getDataPage(pageNumber: number): void {
    if (pageNumber < 1) {
      pageNumber = 1;
  }
    this.pageNumber = pageNumber; 
    this.refresh(); 
  }

  // Refresh the list
  refresh(): void {
    this.list({
      keyword: this.keyword,
      isActive: this.isActive,
      maxResultCount: this.maxResultCount,
      skipCount: (this.pageNumber - 1) * this.maxResultCount,
    }, this.pageNumber, () => {
      
    });
  }
}
