package com.blog.service;

import com.blog.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();
    Category findById(Integer id);
    Category create(Category category);
    Category update(Category category);
    void delete(Integer id);
}
