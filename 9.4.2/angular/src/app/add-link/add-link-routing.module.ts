import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLinkComponent } from './add-link.component';

const routes: Routes = [{ path: '', component: AddLinkComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLinkRoutingModule { }
