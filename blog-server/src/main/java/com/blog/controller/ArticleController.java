package com.blog.controller;

import com.blog.common.PageResult;
import com.blog.common.Result;
import com.blog.dto.ArticleDto;
import com.blog.dto.ArticleQueryDto;
import com.blog.entity.Article;
import com.blog.service.ArticleService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public Result<PageResult<Article>> list(ArticleQueryDto query) {
        // 由前端决定是否过滤 status，后端不做默认值假设
        return Result.success(articleService.findPage(query));
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> detail(@PathVariable Integer id) {
        return Result.success(articleService.findById(id));
    }

    @PostMapping
    public Result<Article> create(@RequestBody ArticleDto articleDto, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        Article article = articleService.create(articleDto, userId);
        return Result.success(article);
    }

    @PutMapping("/{id}")
    public Result<Article> update(@PathVariable Integer id, @RequestBody ArticleDto articleDto,
                                   HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        Article article = articleService.update(id, articleDto, userId, role);
        return Result.success(article);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Integer id, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        articleService.delete(id, userId, role);
        return Result.success();
    }
}
