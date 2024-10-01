import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CreateCountryDialogComponent } from './create-country/create-country.component';
import { EditCountryDialogComponent } from './edit-country/edit-country.component';
import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesComponent } from './countries.component';
import { CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewCountryDialogComponent } from './view-country-dialog/view-country-dialog.component';
// import { AbpPaginationControlsModule } from 'your-path-to-pagination-controls';
@NgModule({
    declarations: [
        CountriesComponent, 
        CreateCountryDialogComponent,  
        EditCountryDialogComponent,
        ViewCountryDialogComponent
    ],
    imports: [
        SharedModule, 
        CountriesRoutingModule,
        CommonModule,
        FormsModule, 
        ReactiveFormsModule,
        NgxPaginationModule
        // AbpPaginationControlsModule,
    
    ],
    exports: [
        NgxPaginationModule // Export it if used in multiple modules
      ],

    providers: [CountryServiceProxy],
    
})
export class CountriesModule {}
