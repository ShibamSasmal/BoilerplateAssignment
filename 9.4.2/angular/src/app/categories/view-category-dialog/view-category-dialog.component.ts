import { 
  Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectorRef 
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CategoryServiceProxy, CreateUserAndLinkMappingDto, LinkDto, UserAndLinkMappingDto, UserAndLinkMappingServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-view-category-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, SharedModule],
  templateUrl: './view-category-dialog.component.html',
  styleUrls: ['./view-category-dialog.component.css'],
  providers: [UserAndLinkMappingServiceProxy] // Add the service here
})
export class ViewCategoryDialogComponent implements OnInit {
  @Input() categoryId: number; 
  @Output() onClose: EventEmitter<void> = new EventEmitter(); 
  @Output() errorOccurred: EventEmitter<any> = new EventEmitter(); 

  name: string;
  links: LinkDto[] = []; 
  userLinkMappings: UserAndLinkMappingDto[] = [];
  isLoading = true; 

  constructor(
    private _categoryServiceProxy: CategoryServiceProxy,
    private _userAndLinkMappingService: UserAndLinkMappingServiceProxy,
    private abpSession: AbpSessionService,
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef 
  ) {}

  // ngOnInit(): void {
  //   if (this.categoryId !== undefined) {
  //     this.getAllLinksByCategoryId(this.categoryId);
  //   } else {
  //     console.error('Category ID is undefined');
  //     this.isLoading = false; 
  //     this.cdr.detectChanges(); 
  //   }
  // }

  // getAllLinksByCategoryId(categoryId: number): void {
  //   this.isLoading = true;
  //   this._categoryServiceProxy.getAllLinksByCategoryId(categoryId) // Corrected here: use categoryId parameter
  //     .subscribe(
  //       (result: LinkDto[]) => {
  //         console.log('Fetched links:', result);
  //         this.links = result.map(link => {
  //           const updatedLink = new LinkDto(); // Make sure LinkDto has a constructor that can initialize its properties
  //           Object.assign(updatedLink, link); // Assign properties correctly
  //           updatedLink.isActive = false; // Initialize isActive to false
  //           return updatedLink;
  //         });
  //         this.isLoading = false;
  //         this.cdr.detectChanges(); 
  //       },
  //       (error) => {
  //         this.isLoading = false; 
  //         console.error('Error fetching links:', error);
  //         this.errorOccurred.emit(error);
  //         this.cdr.detectChanges(); 
  //       }
  //     );
  // }

  ngOnInit(): void {
    if (this.categoryId !== undefined && this.categoryId !== null) {
      this.getAllLinksByCategoryIdAndUserId(this.categoryId);
    } else {
      console.error('Category ID is undefined or null');
      this.isLoading = false; 
      this.cdr.detectChanges(); 
    }
  }

getAllLinksByCategoryIdAndUserId(categoryId: number): void {
    this.isLoading = true;
    const userId = this.getCurrentUserId(); // Fetch the current user ID

    this._categoryServiceProxy.getAllLinksByCategoryIdAndUserId(categoryId, userId)
      .subscribe(
        (result: LinkDto[]) => {
          console.log('Fetched links:', result);
          this.links = result.map(link => {
            return {
              ...link,
              isActive: link.isActive 
            } as LinkDto; 
          });
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        (error) => {
          this.isLoading = false;
          console.error('Error fetching links:', error);
          this.errorOccurred.emit(error);
          this.cdr.detectChanges();
        }
      );
}


  getUserMappings(): void {
    const userId = this.getCurrentUserId(); 
    this._userAndLinkMappingService.getMappingsForUserAndCategory(userId, this.categoryId)
      .subscribe(
        (mappings: UserAndLinkMappingDto[]) => {
          this.userLinkMappings = mappings;

          this.links.forEach(link => {
            const userMapping = mappings.find(mapping => mapping.linkId === link.id);
            link.isActive = userMapping ? userMapping.isActive : false;
          });
        },
        (error) => {
          console.error('Error fetching user link mappings:', error);
          this.errorOccurred.emit(error);
        }
      );
  }

  save(): void {
    const userId = this.getCurrentUserId();

    const mappingsToSave: CreateUserAndLinkMappingDto[] = this.links.map(link => {
      const mapping = new CreateUserAndLinkMappingDto();
      debugger
      mapping.userId = userId;
      mapping.linkId = link.id;
      mapping.categoryId = link.categoryId;
      mapping.isActive = link.isActive;
      return mapping;
    });

    console.log('Mappings to save:', mappingsToSave);

    this._userAndLinkMappingService.saveMappings(mappingsToSave)
        .subscribe(
            () => {
                console.log('Mappings saved successfully');
                this.close();
            },
            (error) => {
                console.error('Error saving mappings:', error);
                this.errorOccurred.emit(error);
            }
        );
  }

  getCurrentUserId(): number {
    return this.abpSession.userId; // Retrieve the current user ID from AbpSession
  }

  close(): void {
    this.onClose.emit(); 
    this.bsModalRef.hide(); 
  }
}
