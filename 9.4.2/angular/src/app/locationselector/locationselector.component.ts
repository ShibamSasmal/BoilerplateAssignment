import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CountriesDto, StateDto, CityDto, LocationServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-location-selector',
  templateUrl: './locationselector.component.html',
  styleUrls: ['./locationselector.component.css']
})
export class LocationSelectorComponent implements OnInit {
  countries: CountriesDto[] = [];  
  states: StateDto[] = [];         
  cities: CityDto[] = [];          

  selectedCountry: number | null = null;
  selectedState: number | null = null;

  constructor(
    private locationService: LocationServiceProxy,
    private cdr: ChangeDetectorRef // Injecting ChangeDetectorRef for change detection
  ) {}

  ngOnInit(): void {
    this.getCountries(); // Fetch countries when component loads
  }

  // Fetch countries from the service
  getCountries(): void {
    this.locationService.getAllCountries().subscribe({
      next: (result: any) => {
        console.log("Countries data fetched:", result); // Log fetched data
        this.countries = result; // Bind the result to the countries array
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => {
        console.error("Failed to load countries", err); // Log any errors
      }
    });
  }

  // Fetch states based on selected country
  onCountrySelect(countryId: number): void {
    this.selectedCountry = countryId;
    this.states = [];   // Reset states array when country changes
    this.cities = [];   // Reset cities array when country changes
    this.selectedState = null; // Reset selected state

    if (countryId) {
      this.locationService.getStatesByCountry(countryId).subscribe({
        next: (result: StateDto[]) => {
          console.log("States data fetched for country:", countryId, result); // Log fetched data
          this.states = result; // Bind states data
          this.cdr.detectChanges(); // Force change detection for states
        },
        error: (err) => {
          console.error("Failed to load states", err);
        }
      });
    }
  }

  // Fetch cities based on selected state
  onStateSelect(stateId: number): void {
    this.selectedState = stateId;
    this.cities = []; // Reset cities array when state changes

    if (stateId) {
      this.locationService.getCitiesByState(stateId).subscribe({
        next: (result: CityDto[]) => {
          console.log("Cities data fetched for state:", stateId, result); // Log fetched data
          this.cities = result; // Bind cities data
          this.cdr.detectChanges(); // Force change detection for cities
        },
        error: (err) => {
          console.error("Failed to load cities", err);
        }
      });
    }
  }
}
