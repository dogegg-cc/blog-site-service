import { request } from './request';
import type { Category as HomeCategory, Tag as HomeTag, Article as HomeArticle } from './home';

export interface Tag extends HomeTag {
  categoryId: string;
}

export interface Category extends HomeCategory {
  slug: string;
  tags: Tag[];
}

export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  tagId?: string;
}

export interface ArticleListResponse {
  total: number;
  items: HomeArticle[];
}

/**
 * 获取分类列表（包含标签）
 */
export const getCategoryList = (): Promise<Category[]> => {
  return request.get<Category[]>('/api/blog/category/list');
};

/**
 * 获取文章列表
 */
export const getArticleList = (params: ArticleListParams): Promise<ArticleListResponse> => {
  return request.get<ArticleListResponse>('/api/blog/list', params);
};
