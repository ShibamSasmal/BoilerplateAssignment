import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksRoutingModule } from './links-routing.module';
import { LinksComponent } from './links.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule here
import { EditLinkDialogComponent } from './edit-links/edit-links-dialog/edit-links-dialog.component'; // Ensure this import is correct
import { CreateLinkDialogComponent } from './create-links/create-links-dialog/create-links-dialog.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    LinksComponent,
    EditLinkDialogComponent,
    CreateLinkDialogComponent
],
  imports: [
    CommonModule,
    LinksRoutingModule,
    SharedModule,
    FormsModule ,// Ensure FormsModule is imported here
    ReactiveFormsModule,
    MultiSelectModule,
    DropdownModule,
    

  ],
  
  // exports: [
  //   ReactiveFormsModule,
  //   FormsModule,
  //   EditCategoryDialogComponent,
    

  // ],
  
})
export class LinksModule {}
