import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoriersListComponent } from './editoriers-list.component';

describe('EditoriersListComponent', () => {
  let component: EditoriersListComponent;
  let fixture: ComponentFixture<EditoriersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditoriersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoriersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
