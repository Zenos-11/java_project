package com.blog.dto;

public class ArticleQueryDto {
    private Integer page = 1;
    private Integer pageSize = 10;
    private String keyword;
    private Integer categoryId;
    private String status;

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }
    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getOffset() {
        return (page - 1) * pageSize;
    }
}
