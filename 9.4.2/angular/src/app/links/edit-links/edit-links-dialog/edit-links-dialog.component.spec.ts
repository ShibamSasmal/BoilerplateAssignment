import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLinkDialogComponent } from './edit-links-dialog.component';

describe('EditLinkDialogComponent', () => {  // Updated the test description to match the component name
  let component: EditLinkDialogComponent;
  let fixture: ComponentFixture<EditLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLinkDialogComponent]  // Use 'declarations' instead of 'imports'
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
