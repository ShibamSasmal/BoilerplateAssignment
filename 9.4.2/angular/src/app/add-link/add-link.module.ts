import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLinkRoutingModule } from './add-link-routing.module';
import { AddLinkComponent } from './add-link.component';
import { DropdownModule } from 'primeng/dropdown';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { MultiSelectModule } from 'primeng/multiselect';
import { HttpClientModule } from '@angular/common/http';
// import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AddLinkComponent
  ],
  imports: [
    CommonModule,
    AddLinkRoutingModule,
    DropdownModule,
    FormsModule,
    ImageCropperComponent,
    InputTextModule,
    SharedModule,
    ModalModule.forRoot(),
   MultiSelectModule,
   HttpClientModule,
   
    // BrowserModule

    // ImageCropperModule
  
  ]
})
export class AddLinkModule { }
