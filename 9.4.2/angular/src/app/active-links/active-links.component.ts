import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryServiceProxy, UserAndLinkMappingServiceProxy, UserAndLinkMappingDto, CategoryDtoPagedResultDto, CategoryDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PrimeIcons } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

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
  constructor(
    private http: HttpClient,
    private linkService: UserAndLinkMappingServiceProxy,
    private sessionService: AppSessionService,
    private categoryService: CategoryServiceProxy,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
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

  // Filter suggestions for autocomplete (you can replace this with actual logic)
  filterSuggestions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSuggestions = this.categories
      .map(category => category.name)
      .filter(name => name.toLowerCase().includes(query));
  }









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
}
