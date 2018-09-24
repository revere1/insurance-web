import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystFormComponent } from './analyst-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnalystFormComponent', () => {
  let component: AnalystFormComponent;
  let fixture: ComponentFixture<AnalystFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ AnalystFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
