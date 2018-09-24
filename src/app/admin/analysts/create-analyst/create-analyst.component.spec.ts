import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAnalystComponent } from './create-analyst.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateAnalystComponent', () => {
  let component: CreateAnalystComponent;
  let fixture: ComponentFixture<CreateAnalystComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ CreateAnalystComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
