import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierFormComponent } from './editorier-form.component';

describe('EditorierFormComponent', () => {
  let component: EditorierFormComponent;
  let fixture: ComponentFixture<EditorierFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
