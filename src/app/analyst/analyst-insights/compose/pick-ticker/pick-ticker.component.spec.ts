import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickTickerComponent } from './pick-ticker.component';

describe('PickTickerComponent', () => {
  let component: PickTickerComponent;
  let fixture: ComponentFixture<PickTickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickTickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
