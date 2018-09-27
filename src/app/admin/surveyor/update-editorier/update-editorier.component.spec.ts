import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEditorierComponent } from './update-editorier.component';

describe('UpdateEditorierComponent', () => {
  let component: UpdateEditorierComponent;
  let fixture: ComponentFixture<UpdateEditorierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEditorierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEditorierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
