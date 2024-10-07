import { Component, OnInit } from '@angular/core';
import { CategoryServiceProxy, LinkDto, CategoryDtoPagedResultDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-active-links',
  templateUrl: './active-links.component.html',
  styleUrls: ['./active-links.component.css']
})
export class ActiveLinksComponent implements OnInit {
  categories: any[] = []; // Array to hold categories
  selectedCategoryId: number | null = null; // Currently selected category ID
  activeLinks: LinkDto[] = []; // Array to hold active links
  isLoading = true; // Loading state

  constructor(private _categoryServiceProxy: CategoryServiceProxy) {}

  ngOnInit(): void {
    this.getCategories(); // Fetch categories on initialization
  }

  // Updated method to fetch categories
  getCategories(): void {
    this.isLoading = true;
    // Call getAll with default parameters
    this._categoryServiceProxy.getAll('', 0, 100).subscribe(
      (result: CategoryDtoPagedResultDto) => {
        this.categories = result.items; // Assuming the response has an 'items' array with the categories
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.isLoading = false;
      }
    );
  }

  onCategoryChange(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    // this.getActiveLinksByCategoryId(categoryId);
  }

  // getActiveLinksByCategoryId(categoryId: number): void {
  //   this.isLoading = true;
  //   this._categoryServiceProxy.getAllLinksByCategoryId(categoryId).subscribe(
  //     (result: LinkDto[]) => {
  //       // Filter to get only active links
  //       this.activeLinks = result.filter(link => link.isActive); // Assuming LinkDto has an isActive property
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       console.error('Error fetching active links:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }
}
