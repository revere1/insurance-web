import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpReplyFormComponent } from './help-reply-form.component';

describe('HelpReplyComponent', () => {
  let component: HelpReplyFormComponent;
  let fixture: ComponentFixture<HelpReplyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpReplyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
