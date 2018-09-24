import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestInsightsComponent } from './latest-insights.component';

describe('LatestInsightsComponent', () => {
  let component: LatestInsightsComponent;
  let fixture: ComponentFixture<LatestInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
