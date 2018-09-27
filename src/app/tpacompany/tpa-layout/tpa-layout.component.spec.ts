import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpaLayoutComponent } from './tpa-layout.component';

describe('AnalystLayoutComponent', () => {
  let component: TpaLayoutComponent;
  let fixture: ComponentFixture<TpaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
