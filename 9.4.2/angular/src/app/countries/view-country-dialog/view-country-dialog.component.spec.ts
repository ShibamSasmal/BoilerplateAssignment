import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCountryDialogComponent } from './view-country-dialog.component';

describe('ViewCountryDialogComponent', () => {
  let component: ViewCountryDialogComponent;
  let fixture: ComponentFixture<ViewCountryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCountryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCountryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
