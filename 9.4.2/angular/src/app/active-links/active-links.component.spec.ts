import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLinksComponent } from './active-links.component';

describe('ActiveLinksComponent', () => {
  let component: ActiveLinksComponent;
  let fixture: ComponentFixture<ActiveLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
