import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTickerComponent } from './update-ticker.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateTickerComponent', () => {
  let component: UpdateTickerComponent;
  let fixture: ComponentFixture<UpdateTickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ UpdateTickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
