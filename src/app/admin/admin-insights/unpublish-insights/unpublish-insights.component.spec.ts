import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishInsightsComponent } from './unpublish-insights.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UnpublishInsightsComponent', () => {
  let component: UnpublishInsightsComponent;
  let fixture: ComponentFixture<UnpublishInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ UnpublishInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
