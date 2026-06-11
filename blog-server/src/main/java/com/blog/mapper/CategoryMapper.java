package com.blog.mapper;

import com.blog.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
    Category findById(@Param("id") Integer id);
    int insert(Category category);
    int update(Category category);
    int deleteById(@Param("id") Integer id);
}
