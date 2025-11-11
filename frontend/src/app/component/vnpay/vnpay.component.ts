import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../service/order.service'; // Đảm bảo đường dẫn này chính xác
import { Order } from '../../dto/order/order-response';   // Đảm bảo đường dẫn này chính xác
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vnpay',
  templateUrl: './vnpay.component.html',
  styleUrl: './vnpay.component.css'
})
export class VnpayComponent implements OnInit {

  order$: Observable<Order> | undefined;
  orderId!: number;
  isLoading = false;

  constructor(
    private route: ActivatedRoute, // Để đọc URL
    private router: Router,         // Để điều hướng
    private orderService: OrderService // Để lấy thông tin đơn hàng
  ) {}

  ngOnInit(): void {
    // 1. Lấy orderId từ URL
    const idParam = this.route.snapshot.paramMap.get('orderId');
    
    if (idParam) {
      this.orderId = +idParam; // Dấu '+' để chuyển string sang number
      // 2. Lấy thông tin đơn hàng để hiển thị
      this.order$ = this.orderService.getOrder(this.orderId);
    } else {
      // Nếu không có orderId, quay lại giỏ hàng
      console.error('Không tìm thấy Order ID');
      this.router.navigate(['/cart']);
    }
  }

  /**
   * Hàm này giả lập việc thanh toán VNPAY thành công
   */
  fakePaySuccess(): void {
    this.isLoading = true;
    
    // Trong ứng dụng thật, bạn sẽ gọi API backend tại đây
    // để xác nhận thanh toán đã thành công
    
    console.log('Fake payment successful for order:', this.orderId);
    
    // 3. Điều hướng đến trang xác nhận đơn hàng khi thành công
    this.router.navigate(['/order-confirmation', this.orderId]);
  }

  /**
   * Hàm này giả lập việc hủy thanh toán
   */
  cancelPayment(): void {
    // Trong ứng dụng thật, bạn có thể gọi API backend để
    // cập nhật trạng thái đơn hàng là "CANCELLED"
    console.log('Payment cancelled for order:', this.orderId);
    
    // Quay lại giỏ hàng
    this.router.navigate(['/cart']);
  }
}