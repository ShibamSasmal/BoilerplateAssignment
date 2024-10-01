import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';

import { SharedModule } from '@shared/shared.module';
import { CreateCountryDialogComponent } from '@app/countries/create-country/create-country.component';
import { CreateCategoryDialogComponent } from './create-category/create-category-dialog/create-category-dialog.component';
import { EditCategoryDialogComponent } from './edit-category/edit-category-dialog/edit-category-dialog.component';
import { CategoriesComponent } from './categories.component';
import { CategoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CategoriesComponent,
    CreateCategoryDialogComponent,
    EditCategoryDialogComponent
    

  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    FormsModule
  ],
  providers : [CategoryServiceProxy]
})
export class CategoriesModule { }
