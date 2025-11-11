import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VnpayComponent } from './vnpay.component';

describe('VnpayComponent', () => {
  let component: VnpayComponent;
  let fixture: ComponentFixture<VnpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VnpayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VnpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
