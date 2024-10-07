import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveLinksRoutingModule } from './active-links-routing.module';

import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ActiveLinksComponent } from './active-links.component';



@NgModule({
  declarations: [
    ActiveLinksComponent
  ],
  imports: [
    CommonModule,
    ActiveLinksRoutingModule,
    SharedModule,
    FormsModule,
    
  ]
})
export class ActiveLinksModule { }
