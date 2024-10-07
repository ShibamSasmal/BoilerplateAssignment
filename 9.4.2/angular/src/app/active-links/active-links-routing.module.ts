import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveLinksComponent } from './active-links.component';

const routes: Routes = [{ path: '', component: ActiveLinksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveLinksRoutingModule { }
