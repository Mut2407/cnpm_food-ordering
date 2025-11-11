import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { Order } from '../../dto/order/order-response';
import { Page } from '../../dto/Page';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  ordersPage$: Observable<Page<Order> | null> = of(null);
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  userId: number | undefined;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.ordersPage$ = this.userService.user$.pipe(
      tap(user => {
        this.userId = user?.userId;
      }),
      switchMap(user => {
        if (user && user.userId) {
          return this.loadOrders(user.userId, this.currentPage, this.pageSize);
        } else {
          return of(null); // Trả về null nếu không có user
        }
      })
    );
  }

  loadOrders(userId: number, page: number, size: number): Observable<Page<Order>> {
    return this.orderService.getOrdersByUserId(userId, page, size).pipe(
      tap(pageData => {
        this.totalPages = pageData.totalPages;
        this.currentPage = pageData.number;
      })
    );
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && this.userId) {
      this.currentPage = page;
      this.ordersPage$ = this.loadOrders(this.userId, this.currentPage, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0 && this.userId) {
      this.currentPage--;
      this.ordersPage$ = this.loadOrders(this.userId, this.currentPage, this.pageSize);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1 && this.userId) {
      this.currentPage++;
      this.ordersPage$ = this.loadOrders(this.userId, this.currentPage, this.pageSize);
    }
  }

  isFirstPage(): boolean {
    return this.currentPage === 0;
  }

  isLastPage(): boolean {
    return this.currentPage >= this.totalPages - 1;
  }
}