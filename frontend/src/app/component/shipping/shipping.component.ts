import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../service/order.service';
import { OrderRequest } from '../../dto/order/order-request';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../dto/CartItem';
import { Observable, map, switchMap, take } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.css'
})
export class ShippingComponent implements OnInit {

  shippingForm!: FormGroup;
  cartItems$: Observable<CartItem[]> | undefined;
  total$: Observable<number> | undefined;
  baseUrl = environment.baseUrl;
  userId!: number;
  isLoading = false;
  
  //Thue vnpay
  private readonly TAX_RATE = 0.08;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private UserService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUserId();
    this.shippingForm = this.formBuilder.group({
      recipientName: ['', Validators.required],
      // Thêm Validators.email để kiểm tra email
      contactEmail: ['', [Validators.required, Validators.email]],
      shippingAddress: ['', Validators.required],
      contactPhone: ['', Validators.required],
      paymentMethod: ['COD', Validators.required]
    });

    this.cartItems$ = this.cartService.getCartItems();

    this.total$ = this.cartItems$.pipe(
      map(items => {
        const subtotal = items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
        // Tính tổng tiền bao gồm thuế
        return subtotal + (subtotal * this.TAX_RATE);
      })
    );

    // Tự động điền thông tin người dùng
    this.UserService.user$.subscribe(user => {
      if (user) {
        this.shippingForm.patchValue({
          recipientName: user.username,
          contactEmail: user.email,
          shippingAddress: user.address || ''
        });
      }
    });
  }

  onSubmit() {
    // Đánh dấu tất cả các trường là 'touched' để hiển thị lỗi validation
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return; 
    }

    this.isLoading = true; // Bật cờ loading

    this.cartItems$?.pipe(
      take(1), // Chỉ lấy giá trị đầu tiên của giỏ hàng
      map(items => items.map(cartItem => ({  // Chuyển đổi CartItem -> OrderItemRequest
        menuItemId: cartItem.menuItem.menuItemId,
        quantity: cartItem.quantity
      }))),
      switchMap(orderItems => {  // Tạo OrderRequest
        const orderRequest: OrderRequest = {
          userId: this.userId,
          recipientName: this.shippingForm.value.recipientName,
          contactEmail: this.shippingForm.value.contactEmail,
          shippingAddress: this.shippingForm.value.shippingAddress,
          contactPhone: this.shippingForm.value.contactPhone,
          items: orderItems,
          paymentMethod: this.shippingForm.value.paymentMethod
        };
        // Luôn tạo đơn hàng trong CSDL
        return this.orderService.createOrder(orderRequest); 
      })
    ).subscribe({
      next: (order) => {
        // Lấy phương thức thanh toán từ form
        const paymentMethod = this.shippingForm.value.paymentMethod;

        // Xóa giỏ hàng
        this.cartService.clearCart();
        this.isLoading = false; // Tắt cờ loading

        // Phân luồng dựa trên phương thức thanh toán
        if (paymentMethod === 'COD') {
          // 1. Nếu là COD, đi đến trang xác nhận đơn hàng
          this.router.navigate(['/order-confirmation', order.orderId]);
        } else if (paymentMethod === 'VNPAY') {
          // 2. Nếu là VNPAY, đi đến trang thanh toán VNPAY (fake)
          // (Chúng ta giả định route là '/vnpay-payment/:orderId' đã được định nghĩa)
          this.router.navigate(['/vnpay-payment', order.orderId]);
        }
      },
      error: (err) => {
        console.error("Error creating order:", err); // Xử lý lỗi
        this.isLoading = false; // Tắt cờ loading khi có lỗi
      }
    });
  }

  getUserId() {
    this.UserService.user$.subscribe(user => {
      if (user) {
        this.userId = user.userId!;
        // console.log(this.userId); // Dòng này đã có
      }
    });
  }

  /**
   * Hàm trợ giúp để kiểm tra lỗi validation trên template
   * @param fieldName Tên của trường trong form
   * @returns boolean
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Hàm trợ giúp để kiểm tra lỗi cụ thể (ví dụ: 'required', 'email')
   * @param fieldName Tên của trường
   * @param errorName Tên của lỗi (vd: 'required')
   * @returns boolean
   */
  getFieldError(fieldName: string, errorName: string): boolean {
    const field = this.shippingForm.get(fieldName);
    return !!(field && field.hasError(errorName));
  }
}