package com.vanhuy.order_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vanhuy.order_service.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
