import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [UsersComponent, ResetPasswordDialogComponent, EditUserDialogComponent, CreateUserDialogComponent, ChangePasswordComponent],
    imports: [SharedModule, UsersRoutingModule,CommonModule,DropdownModule,FormsModule,],
})
export class UsersModule {}