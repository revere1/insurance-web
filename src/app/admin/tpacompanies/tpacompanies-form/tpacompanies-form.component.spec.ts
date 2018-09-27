import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpacompaniesFormComponent } from './tpacompanies-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TpacompaniesFormComponent', () => {
  let component: TpacompaniesFormComponent;
  let fixture: ComponentFixture<TpacompaniesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ TpacompaniesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpacompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
