import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyorLayoutComponent } from './surveyor-layout.component';

describe('EditorierLayoutComponent', () => {
  let component: SurveyorLayoutComponent;
  let fixture: ComponentFixture<SurveyorLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyorLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
