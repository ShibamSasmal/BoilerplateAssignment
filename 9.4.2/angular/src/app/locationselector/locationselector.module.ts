import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationselectorRoutingModule } from './locationselector-routing.module';
import { LocationSelectorComponent } from './locationselector.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    LocationSelectorComponent
  ],
  imports: [
    CommonModule,
    LocationselectorRoutingModule,
    SharedModule
  ]
})
export class LocationSelectorModule { }
