import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFormListComponent } from './message-form-list.component';

describe('MessageFormListComponent', () => {
  let component: MessageFormListComponent;
  let fixture: ComponentFixture<MessageFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
