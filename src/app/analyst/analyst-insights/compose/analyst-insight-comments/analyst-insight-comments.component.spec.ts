import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystInsightCommentsComponent } from './analyst-insight-comments.component';

describe('AnalystInsightCommentsComponent', () => {
  let component: AnalystInsightCommentsComponent;
  let fixture: ComponentFixture<AnalystInsightCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystInsightCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystInsightCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
