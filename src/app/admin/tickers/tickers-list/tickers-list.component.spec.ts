import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickersListComponent } from './tickers-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TickersListComponent', () => {
  let component: TickersListComponent;
  let fixture: ComponentFixture<TickersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ TickersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
