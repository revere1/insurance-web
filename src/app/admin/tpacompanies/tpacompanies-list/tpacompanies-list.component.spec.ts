import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystsListComponent } from './analysts-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnalystsListComponent', () => {
  let component: AnalystsListComponent;
  let fixture: ComponentFixture<AnalystsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ AnalystsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
