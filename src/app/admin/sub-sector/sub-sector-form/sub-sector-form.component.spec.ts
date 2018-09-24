import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectorFormComponent } from './sub-sector-form.component';

describe('SubSectorFormComponent', () => {
  let component: SubSectorFormComponent;
  let fixture: ComponentFixture<SubSectorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubSectorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubSectorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
