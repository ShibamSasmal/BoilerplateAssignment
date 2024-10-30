import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryServiceProxy, UserAndLinkMappingServiceProxy, UserAndLinkMappingDto, CategoryDtoPagedResultDto, CategoryDto, LinkDto, LinkServiceProxy, DashboardNoteServiceProxy, CreateDashboardNoteDetailDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PrimeIcons } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { CreateLinkDialogComponent } from '@app/links/create-links/create-links-dialog/create-links-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { LinkDialog } from '@app/links/links.component';
import { AddLinkComponent } from '@app/add-link/add-link.component';

@Component({
  selector: 'app-active-links',
  templateUrl: './active-links.component.html',
  styleUrls: ['./active-links.component.css'],
  providers: [MessageService]
})
export class ActiveLinksComponent implements OnInit {
  
  serverRootAddress: string = 'https://localhost:44311/';
  categories: CategoryDto[] = [];
  activeLinksByCategory: { [categoryId: number]: UserAndLinkMappingDto[] } = {};
  
  // Search-related properties
  searchEngines: any[] = []; // Search engine options
  selectedSearchEngines: any[] = []; // Selected search engines by the user
  searchQuery: string = ''; // The user's search term
  filteredSuggestions: string[] = []; // Filtered suggestions for autocomplete
  private lastSelectedSearchEngines: any[] = []; 
  text: string | undefined;
  constructor(
    private http: HttpClient,
    private linkService: UserAndLinkMappingServiceProxy,
    private sessionService: AppSessionService,
    private categoryService: CategoryServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
     private _modalService: BsModalService,
     private _linkserviceProxy : LinkServiceProxy,
     private _DashboardNoteService : DashboardNoteServiceProxy
  ) {}

  ngOnInit(): void {
    this.loadUserNotes(),
    this.loadCategories();
    this.initializeSearchEngines();
    this.selectedSearchEngines = [this.searchEngines[0]]; 
    this.lastSelectedSearchEngines = [...this.selectedSearchEngines];
  }

  // Initialize the search engines
  initializeSearchEngines() {
    this.searchEngines = [
      { name: 'Google', url: 'https://www.google.com/search?q=' },
      { name: 'Bing', url: 'https://www.bing.com/search?q=' },
      { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
      
    ];
    
  }



  onSearchEngineChange(event: any) {
    if (event.value.length === 0) {
      // Revert to the last valid selection if available
      this.selectedSearchEngines = this.lastSelectedSearchEngines.length > 0 ? [...this.lastSelectedSearchEngines] : [this.searchEngines[0]];
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'At least one search engine must be selected. Defaulting to the last valid selection.' });
    } else {
      // Update the last valid selection
      this.lastSelectedSearchEngines = [...event.value];
    }
  }

  // filterSuggestions(event: any) {
  //   const query = event.query;

  //   if (query) {
  //     const url = `https://api.duckduckgo.com/?q=${query}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;

  //     this.http.get<any>(url).subscribe(
  //       (response: any) => {
  //         if (response.RelatedTopics) {
  //           this.filteredSuggestions = response.RelatedTopics.map((item: any) => item.Text);
  //         }
  //       },
  //       (error: any) => {
  //         console.error('Error fetching suggestions:', error);
  //       }
  //     );
  //   } else {
  //     this.filteredSuggestions = [];
  //   }
  // }
  
  
  



  // Function to perform the search on selected search engines
  performSearch() {
    if (this.selectedSearchEngines.length === 0 || !this.searchQuery) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select search engines and enter a search term.' });
      return;
    }

    this.selectedSearchEngines.forEach(engine => {
      const searchUrl = `${engine.url}${this.searchQuery}`;
      window.open(searchUrl, '_blank');
    });
  }

  loadUserNotes() {
    const userId = this.sessionService.userId;
    if (userId) {
      this._DashboardNoteService.getNotesByUserId(userId).subscribe(notes => {
        if (notes && notes.length > 0) {
          this.text = notes[notes.length-1].htmlContent;
        }
      }, error => {
        console.error('Error loading notes:', error);
      });
    } else {
      console.error('User ID not found in session.');
    }
  }

  saveNote() {
    // debugger
    
    console.log("savenoteCalled")
    const userId = this.sessionService.userId;
    if (userId) {
      
      const noteDetail = new CreateDashboardNoteDetailDto();
      noteDetail.userId = userId;
      noteDetail.htmlContent = this.text;

      this._DashboardNoteService.create(noteDetail).subscribe(
        response => {
          console.log('Note saved successfully!', response);
        },
        error => {
          console.error('Error saving note:', error);
        }
      );
    } else {
      console.error('User ID not found in session.');
    }
}

  
  
  

  loadCategories() {
    // Fetch all categories logic
    this.categoryService.getAll(undefined, 0, 100).subscribe(
      (result: CategoryDtoPagedResultDto) => {
        if (result && result.items) {
          this.categories = result.items.filter(category => category.isActive);
          this.categories.forEach(category => {
            this.loadActiveLinksForCategory(category.id);
          });
        } else {
          console.warn('No categories found in the response.');
        }
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

 

  loadActiveLinksForCategory(categoryId: number): void {
    const userId = this.sessionService.userId;
    if (userId) {
      this.linkService.getActiveLinksForUserAndCategory(userId, categoryId).subscribe(
        (activeLinks: UserAndLinkMappingDto[]) => {
          activeLinks.forEach(link => {
            if (link.imageUrl && !link.imageUrl.startsWith('http://') && !link.imageUrl.startsWith('https://')) {
              link.imageUrl = this.serverRootAddress + link.imageUrl;
            }
          });
          this.activeLinksByCategory[categoryId] = activeLinks;
          this.cdr.detectChanges(); // Trigger change detection
        },
        error => {
          console.error(`Error fetching active links for category ${categoryId}:`, error);
        }
      );
    } else {
      console.error('UserId is not available.');
    }
  }

  drop(event: CdkDragDrop<CategoryDto[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.updateCategoryOrder();
  }
  dropLink(event: CdkDragDrop<UserAndLinkMappingDto[]>, categoryId: number) {
    const links = this.activeLinksByCategory[categoryId];
    if (links) {
      moveItemInArray(links, event.previousIndex, event.currentIndex);
      this.updateLinkOrder(categoryId);
    }
  }
  


  updateLinkOrder(categoryId: number) {
    if (!this.activeLinksByCategory[categoryId]) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No active links found for this category.' });
        return;
    }

    const reorderedLinks: UserAndLinkMappingDto[] = this.activeLinksByCategory[categoryId].map((link, index) => {
        return {
            id: link.id, 
            userId: link.userId, 
            linkId: link.linkId, 
            categoryId: link.categoryId, 
            order: index + 1, 
            isActive: link.isActive 
           
        } as UserAndLinkMappingDto; 
    });

    this.linkService.updateLinkOrder(reorderedLinks).subscribe(
        () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link order updated successfully.' });
            this.loadActiveLinksForCategory(categoryId); 
        },
        error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update link order.' });
            console.error('Error updating link order:', error);
        }
    );
}

  updateCategoryOrder() {
    const updatedCategories = this.categories.map((category, index) => {
      const updatedCategory = new CategoryDto();
      updatedCategory.id = category.id;
      updatedCategory.name = category.name;
      updatedCategory.description = category.description;
      updatedCategory.isActive = category.isActive;
      updatedCategory.countryId = category.countryId;
      updatedCategory.order = index + 1;
      return updatedCategory;
    });

    this.categoryService.updateCategoryOrder(updatedCategories).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category order updated successfully.' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category order.' });
        console.error('Error updating category order:', error);
      }
    );
  }

  openLink(url: string): void {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      console.error('Invalid URL:', url);
    }
  }

  // createLinkDialog(): void {
  //   const createLinkDialog: BsModalRef = this._modalService.show(AddLinkComponent, {
  //     class: 'modal-lg',
  //     initialState: {}, // No initial state needed for creating a new link
  //   });

  //   (createLinkDialog.content as LinkDialog).onSave.subscribe(() => {
  //     this.refresh();
  //   });
  // }

  createLinkDialog(): void {
    const createLinkDialog: BsModalRef = this._modalService.show(AddLinkComponent, {
      class: 'modal-lg',
      initialState: {}, 
    });
  
    const content = createLinkDialog.content as AddLinkComponent;
  
    if (content && content.onSave) {
      content.onSave.subscribe(() => {
        this.refresh();
      });
    } else {
      console.error('Modal content or onSave event emitter is missing');
    }
  }
  
  refresh(): void {
    this.loadCategories(); 
  }


  createLink(): void {
    this.createLinkDialog();
  }



}
