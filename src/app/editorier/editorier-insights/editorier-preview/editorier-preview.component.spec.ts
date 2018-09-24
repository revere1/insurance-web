import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierPreviewComponent } from './editorier-preview.component';

describe('EditorierPreviewComponent', () => {
  let component: EditorierPreviewComponent;
  let fixture: ComponentFixture<EditorierPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
