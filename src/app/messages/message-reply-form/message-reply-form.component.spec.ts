import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReplyFormComponent } from './message-reply-form.component';

describe('MessageReplyFormComponent', () => {
  let component: MessageReplyFormComponent;
  let fixture: ComponentFixture<MessageReplyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageReplyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
