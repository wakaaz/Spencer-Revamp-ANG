import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedOrdersDetailComponent } from './completed-orders-detail.component';

describe('CompletedOrdersDetailComponent', () => {
  let component: CompletedOrdersDetailComponent;
  let fixture: ComponentFixture<CompletedOrdersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedOrdersDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
