import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierCommentFormComponent } from './editorier-comment-form.component';

describe('EditorierCommentFormComponent', () => {
  let component: EditorierCommentFormComponent;
  let fixture: ComponentFixture<EditorierCommentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierCommentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
