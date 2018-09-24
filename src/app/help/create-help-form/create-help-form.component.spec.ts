import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHelpFormComponent } from './create-help-form.component';

describe('CreateHelpFormComponent', () => {
  let component: CreateHelpFormComponent;
  let fixture: ComponentFixture<CreateHelpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHelpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHelpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
