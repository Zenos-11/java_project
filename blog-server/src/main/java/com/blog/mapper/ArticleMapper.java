package com.blog.mapper;

import com.blog.dto.ArticleQueryDto;
import com.blog.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleMapper {
    List<Article> findPage(ArticleQueryDto query);
    long count(ArticleQueryDto query);
    Article findById(@Param("id") Integer id);
    int insert(Article article);
    int update(Article article);
    int deleteById(@Param("id") Integer id);
    int incrementViewCount(@Param("id") Integer id);
    int insertTag(@Param("articleId") Integer articleId, @Param("tagId") Integer tagId);
    int deleteTagsByArticleId(@Param("articleId") Integer articleId);
    List<String> findTagsByArticleId(@Param("articleId") Integer articleId);
}
