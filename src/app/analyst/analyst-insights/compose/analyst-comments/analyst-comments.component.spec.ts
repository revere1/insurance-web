import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystCommentsComponent } from './analyst-comments.component';

describe('AnalystCommentsComponent', () => {
  let component: AnalystCommentsComponent;
  let fixture: ComponentFixture<AnalystCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
