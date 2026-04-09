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
 * 详情页文章类型：继承自基础文章并补充正文与访问量
 */
export interface ArticleDetail extends HomeArticle {
  content: string;
  viewCount: number;
  updatedAt: string;
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

/**
 * 获取文章详情
 * @param id 文章唯一标识
 */
export const getArticleDetail = (id: string): Promise<ArticleDetail> => {
  return request.get<ArticleDetail>(`/api/blog/article/${id}`);
};
