import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivillegesComponent } from './privilleges.component';

describe('PrivillegesComponent', () => {
  let component: PrivillegesComponent;
  let fixture: ComponentFixture<PrivillegesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivillegesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivillegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
