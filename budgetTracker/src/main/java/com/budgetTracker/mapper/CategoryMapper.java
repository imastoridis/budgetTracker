package com.budgetTracker.mapper;

import com.budgetTracker.dto.CategoryDto;
import com.budgetTracker.model.entity.Category;
import com.budgetTracker.model.entity.User;

public class CategoryMapper {
    // Convert Entity to DTO
    public static CategoryDto toDto(Category category) {
        if (category == null) return null;

        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setUserId(category.getUser().getId());
        return dto;
    }

    // Convert DTO to Entity
    public static Category toEntity(CategoryDto categoryDto, User user) {

        if (categoryDto == null) return null;

        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setUser(user);
        return category;
    }
}
