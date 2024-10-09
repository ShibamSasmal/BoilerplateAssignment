import { Component, Injector, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  LinkServiceProxy,
  LinkDto,
  LinkDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';
import { CreateLinkDialogComponent } from './create-links/create-links-dialog/create-links-dialog.component';
import { EditLinkDialogComponent } from './edit-links/edit-links-dialog/edit-links-dialog.component';

export interface LinkDialog {
  onSave: EventEmitter<void>;
}

class PagedLinksRequestDto extends PagedRequestDto {
  keyword: string = '';
  sorting: string | undefined;
}

@Component({
  templateUrl: './links.component.html',
  animations: [appModuleAnimation()]
})
export class LinksComponent extends PagedListingComponentBase<LinkDto> {
  serverRootAddress: string = 'https://localhost:44311/';
  links: LinkDto[] = [];
  keyword = '';
  maxResultCount: number = 10;
  isActive: boolean | undefined; 
  isFilterOpen: boolean = false; 
  

  constructor(
    injector: Injector,
    private _linkService: LinkServiceProxy,
    private _modalService: BsModalService,
    cd: ChangeDetectorRef
  ) {
    super(injector, cd);
  }
  toggleIsActiveFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  list(
    request: PagedLinksRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    this._linkService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => finishedCallback()))
      .subscribe((result: LinkDtoPagedResultDto) => {
        this.links = result.items.filter(link =>
          link.linkName.toLowerCase().includes(this.keyword.toLowerCase())
        );

        this.showPaging({
          totalCount: result.totalCount,
          items: this.links.slice((pageNumber - 1) * this.maxResultCount, pageNumber * this.maxResultCount),
        }, pageNumber);

        this.cd.detectChanges();
      }, (error) => {
        abp.notify.error(this.l('ErrorFetchingLinks'));
        console.error('Error fetching links:', error);
      });
  }

  getDataPage(pageNumber: number): void {
    const request = new PagedLinksRequestDto();
    request.skipCount = (pageNumber - 1) * this.maxResultCount;
    request.maxResultCount = this.maxResultCount;
    request.sorting = '';

    this.list(request, pageNumber, () => {});
  }

  delete(link: LinkDto): void {
    abp.message.confirm(
      this.l('LinkDeleteWarningMessage', link.linkName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._linkService.delete(link.id)
            .pipe(finalize(() => {
              abp.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            }))
            .subscribe(() => {});
        }
      }
    );
  }

  // Method to open the create link dialog
  createLinkDialog(): void {
    const createLinkDialog: BsModalRef = this._modalService.show(CreateLinkDialogComponent, {
      class: 'modal-lg',
      initialState: {}, // No initial state needed for creating a new link
    });

    (createLinkDialog.content as LinkDialog).onSave.subscribe(() => {
      this.refresh();
    });
  }

  // Method to open the edit link dialog
  editLinkDialog(linkId: number): void {
    const editLinkDialog: BsModalRef = this._modalService.show(EditLinkDialogComponent, {
      class: 'modal-lg',
      initialState: { linkId }, // Pass the linkId for editing
    });

    (editLinkDialog.content as LinkDialog).onSave.subscribe(() => {
      this.refresh();
    });
  }

  // Event handler for the create button
  createLink(): void {
    this.createLinkDialog();
  }

  // Event handler for the edit button
  editLink(link: LinkDto): void {
    this.editLinkDialog(link.id);
  }

  searchLinks(): void {
    this.getDataPage(1);
  }
}
