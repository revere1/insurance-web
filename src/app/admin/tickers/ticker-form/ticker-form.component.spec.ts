import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerFormComponent } from './ticker-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TickerFormComponent', () => {
  let component: TickerFormComponent;
  let fixture: ComponentFixture<TickerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ TickerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
