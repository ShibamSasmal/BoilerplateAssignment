import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  CountryDto,
  CountryServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './edit-user-dialog.component.html'
})
export class EditUserDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  countries: CountryDto[] = [];
  selectedCountryId: number | null = null;
  checkedRolesMap: { [key: string]: boolean } = {};
  id: number; // User ID to edit

  @Output() onSave = new EventEmitter<any>();
  loadingCountries = false;

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    private _countriesService: CountryServiceProxy,
    public bsModalRef: BsModalRef,
    private cd: ChangeDetectorRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchCountries();
    this.fetchUserDetails(); // Fetch user details using the getAll method
    this.fetchRoles();
  }

  // Fetch user details using getAll method
  fetchUserDetails(): void {
    const keyword = ''; // Use an appropriate keyword if needed
    const isActive = true; // Adjust based on your requirements
    const skipCount = 0; // Start from the first page
    const maxResultCount = 100; // Adjust as needed

    this._userService.getAll(keyword, isActive, skipCount, maxResultCount).subscribe((result) => {
      const foundUser = result.items.find(user => user.id === this.id); // Find user by ID
      if (foundUser) {
        this.user = foundUser; // Populate user data
        this.selectedCountryId = foundUser.countryId; // Populate country ID
        this.setInitialRolesStatus(); // Set role checkboxes
        this.cd.detectChanges();
      } else {
        this.notify.error(this.l('UserNotFound')); // Notify if user not found
      }
    }, (error: HttpErrorResponse) => {
      this.notify.error(this.l('FailedToLoadUser'));
    });
  }

  fetchRoles(): void {
    this._userService.getRoles().subscribe(
      (result) => {
        this.roles = result.items;
        this.setInitialRolesStatus();
        this.cd.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToLoadRoles'));
      }
    );
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return this.checkedRolesMap[normalizedName] || false; // Adjusted for updating user
  }

  onRoleChange(role: RoleDto, $event: any): void {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, (value, key) => {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  fetchCountries(): void {
    this.loadingCountries = true;
    this._countriesService.getAll(undefined, 0, 1000).subscribe(
      (result) => {
        this.countries = result.items;
        this.loadingCountries = false;
        this.cd.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToLoadCountries'));
        this.loadingCountries = false;
      }
    );
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();
    this.user.countryId = this.selectedCountryId ?? 0; 

    this._userService.update(this.user).subscribe(
      () => {
        this.notify.info(this.l('UpdatedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToUpdateUser'));
        this.saving = false;
      }
    );
  }
}
