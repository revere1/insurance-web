import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesFormComponent } from './commodities-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommoditiesFormComponent', () => {
  let component: CommoditiesFormComponent;
  let fixture: ComponentFixture<CommoditiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ CommoditiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoditiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
