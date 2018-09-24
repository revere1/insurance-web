import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInsightCommentFormComponent } from './client-insight-comment-form.component';

describe('ClientInsightCommentFormComponent', () => {
  let component: ClientInsightCommentFormComponent;
  let fixture: ComponentFixture<ClientInsightCommentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInsightCommentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInsightCommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
