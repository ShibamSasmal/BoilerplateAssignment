import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CategoryServiceProxy, UserAndLinkMappingServiceProxy, UserAndLinkMappingDto, CategoryDtoPagedResultDto, CategoryDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service'; 

@Component({
  selector: 'app-active-links',
  templateUrl: './active-links.component.html',
  styleUrls: ['./active-links.component.css']
})
export class ActiveLinksComponent implements OnInit {
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
}
