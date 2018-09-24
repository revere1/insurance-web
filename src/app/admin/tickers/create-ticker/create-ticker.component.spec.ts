import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTickerComponent } from './create-ticker.component';

describe('CreateTickerComponent', () => {
  let component: CreateTickerComponent;
  let fixture: ComponentFixture<CreateTickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
