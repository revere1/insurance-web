import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickersComponent } from './tickers.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TickersComponent', () => {
  let component: TickersComponent;
  let fixture: ComponentFixture<TickersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ TickersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
