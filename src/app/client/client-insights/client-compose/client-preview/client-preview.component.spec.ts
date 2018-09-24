import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPreviewComponent } from './client-preview.component';

describe('ClientPreviewComponent', () => {
  let component: ClientPreviewComponent;
  let fixture: ComponentFixture<ClientPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
