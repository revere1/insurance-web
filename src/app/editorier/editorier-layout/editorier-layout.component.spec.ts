import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorierLayoutComponent } from './editorier-layout.component';

describe('EditorierLayoutComponent', () => {
  let component: EditorierLayoutComponent;
  let fixture: ComponentFixture<EditorierLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorierLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorierLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
