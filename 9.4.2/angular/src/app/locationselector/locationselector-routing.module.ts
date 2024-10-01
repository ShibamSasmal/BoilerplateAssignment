import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationSelectorComponent } from './locationselector.component';
// import { LocationselectorComponent } from './locationselector.component';

const routes: Routes = [{ path: '', component: LocationSelectorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationselectorRoutingModule { }
