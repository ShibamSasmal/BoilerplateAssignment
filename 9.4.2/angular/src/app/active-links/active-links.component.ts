import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryServiceProxy, UserAndLinkMappingServiceProxy, UserAndLinkMappingDto, CategoryDtoPagedResultDto, CategoryDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service'; 

@Component({
  selector: 'app-active-links',
  templateUrl: './active-links.component.html',
  styleUrls: ['./active-links.component.css']
})
export class ActiveLinksComponent implements OnInit {
  serverRootAddress: string = 'https://localhost:44311/';
  categories: CategoryDto[] = []; 
  activeLinksByCategory: { [categoryId: number]: UserAndLinkMappingDto[] } = {};
  
  constructor(
    private linkService: UserAndLinkMappingServiceProxy,
    private sessionService: AppSessionService,
    private categoryService: CategoryServiceProxy, 
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadCategories(); 
  }

  loadCategories() {
    // Fetch all categories
    this.categoryService.getAll(undefined, 0, 100).subscribe(
      (result: CategoryDtoPagedResultDto) => {
        if (result && result.items) {
          // Filter only active categories
          this.categories = result.items.filter(category => category.isActive);
          console.log('Loaded active categories:', this.categories);
  
          // Fetch active links for each active category
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
           // If imageUrl is relative, prepend serverRootAddress
           activeLinks.forEach(link => {
            if (link.imageUrl && !link.imageUrl.startsWith('http://') && !link.imageUrl.startsWith('https://')) {
              link.imageUrl = this.serverRootAddress + link.imageUrl;
            }
          });

          this.activeLinksByCategory[categoryId] = activeLinks;
          this.cdr.detectChanges(); // Trigger change detection
          console.log(`Loaded active links for category ${categoryId}:`, activeLinks);
        },
        error => {
          console.error(`Error fetching active links for category ${categoryId}:`, error);
        }
      );
    } else {
      console.error('UserId is not available.');
    }
  }
  openLink(url: string): void {
    console.log('Opening link:', url); 
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      console.error('Invalid URL:', url);
    }
  }
}
