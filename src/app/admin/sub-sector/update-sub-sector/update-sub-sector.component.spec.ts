import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubSectorComponent } from './update-sub-sector.component';

describe('UpdateSubSectorComponent', () => {
  let component: UpdateSubSectorComponent;
  let fixture: ComponentFixture<UpdateSubSectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSubSectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSubSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
