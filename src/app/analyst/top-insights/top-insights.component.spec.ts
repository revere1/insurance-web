import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopInsightsComponent } from './top-insights.component';

describe('TopInsightsComponent', () => {
  let component: TopInsightsComponent;
  let fixture: ComponentFixture<TopInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
