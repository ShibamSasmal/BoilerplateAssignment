import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveLinksRoutingModule } from './active-links-routing.module';
import { ActiveLinksComponent } from './active-links.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ActiveLinksComponent
  ],
  imports: [
    CommonModule,
    ActiveLinksRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ActiveLinksModule { }
