import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCategoryDialogComponent } from './view-category-dialog.component';

describe('ViewCategoryDialogComponent', () => {
  let component: ViewCategoryDialogComponent;
  let fixture: ComponentFixture<ViewCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
