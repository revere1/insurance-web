import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCreateFormComponent } from './message-create-form.component';

describe('MessageCreateFormComponent', () => {
  let component: MessageCreateFormComponent;
  let fixture: ComponentFixture<MessageCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
