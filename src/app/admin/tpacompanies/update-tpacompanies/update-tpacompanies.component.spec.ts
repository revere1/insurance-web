import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnalystComponent } from './update-analyst.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateAnalystComponent', () => {
  let component: UpdateAnalystComponent;
  let fixture: ComponentFixture<UpdateAnalystComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ UpdateAnalystComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
