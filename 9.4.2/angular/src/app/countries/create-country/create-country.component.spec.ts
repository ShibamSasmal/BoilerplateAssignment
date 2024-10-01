import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCountryDialogComponent } from './create-country.component'; 

describe('CreateCountryDialogComponent', () => {
  let component: CreateCountryDialogComponent; 
  let fixture: ComponentFixture<CreateCountryDialogComponent>; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCountryDialogComponent] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCountryDialogComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
