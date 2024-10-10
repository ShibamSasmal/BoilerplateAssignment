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
  CreateUserDto,
  RoleDto,
  CountryDto,
  CountryServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './create-user-dialog.component.html'
})
export class CreateUserDialogComponent extends AppComponentBase implements OnInit {
  saving = false;
  user = new CreateUserDto();
  roles: RoleDto[] = [];
  countries: CountryDto[] = []; // List of countries
  selectedCountryId: number | null = null; // Single country selection
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

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
    this.user.isActive = true;

    this.fetchCountries();

    this._userService.getRoles().subscribe(
      (result) => {
        this.roles = result.items;
        this.setInitialRolesStatus();
        this.cd.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToLoadRoles'));
        this.cd.detectChanges();
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
    return this.defaultRoleCheckedStatus; // Default role checked status
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
        this.countries = result.items; // Populate the countries array
        this.loadingCountries = false;
        this.cd.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToLoadCountries'));
        this.loadingCountries = false;
        this.cd.detectChanges();
      }
    );
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();
    this.user.countryId = this.selectedCountryId ?? 0; // Assign selected country ID

    this._userService.create(this.user).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      (error: HttpErrorResponse) => {
        this.notify.error(this.l('FailedToSaveUser'));
        this.saving = false;
      }
    );
  }
}
