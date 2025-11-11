export interface OrderRequest {
    userId: number;
    recipientName: string;
    contactEmail: string;
    shippingAddress: string;
    contactPhone: string;
    items: OrderItemRequest[];
    paymentMethod: string;
  }
  
  export interface OrderItemRequest {
    menuItemId: number;
    quantity: number;
  }

  