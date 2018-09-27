import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditorierComponent } from './create-editorier.component';

describe('CreateEditorierComponent', () => {
  let component: CreateEditorierComponent;
  let fixture: ComponentFixture<CreateEditorierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditorierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditorierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
