import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierCommentsComponent } from './editorier-comments.component';

describe('EditorierCommentsComponent', () => {
  let component: EditorierCommentsComponent;
  let fixture: ComponentFixture<EditorierCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
