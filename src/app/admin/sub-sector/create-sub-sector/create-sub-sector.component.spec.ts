import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubSectorComponent } from './create-sub-sector.component';

describe('CreateSubSectorComponent', () => {
  let component: CreateSubSectorComponent;
  let fixture: ComponentFixture<CreateSubSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
