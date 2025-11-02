package com.vanhuy.restaurant_service.dto;

import java.math.BigDecimal;

public record MenuItemDTO(
        Integer menuItemId, String name, BigDecimal price, Integer stock , String imageUrl
) {
}
