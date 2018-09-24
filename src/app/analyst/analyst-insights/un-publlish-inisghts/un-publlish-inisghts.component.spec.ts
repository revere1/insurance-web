import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnPubllishInisghtsComponent } from './un-publlish-inisghts.component';

describe('NonPubllishInisghtsComponent', () => {
  let component: UnPubllishInisghtsComponent;
  let fixture: ComponentFixture<UnPubllishInisghtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnPubllishInisghtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnPubllishInisghtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
