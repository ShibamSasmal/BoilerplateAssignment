import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveLinksRoutingModule } from './active-links-routing.module';

import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ActiveLinksComponent } from './active-links.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { PrimeIcons } from 'primeng/api';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ActiveLinksComponent
  ],
  imports: [
    CommonModule,
    ActiveLinksRoutingModule,
    SharedModule,
    FormsModule,
    DragDropModule,
    CardModule,
    ListboxModule,
    AutoCompleteModule,
    MultiSelectModule,
    HttpClientModule,
    HttpClientJsonpModule,
    
    
  ]
})
export class ActiveLinksModule { }
