import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierSummaryComponent } from './editorier-summary.component';

describe('EditorierSummaryComponent', () => {
  let component: EditorierSummaryComponent;
  let fixture: ComponentFixture<EditorierSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
