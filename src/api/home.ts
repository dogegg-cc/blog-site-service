import { request } from './request';

// --- 数据模型定义 ---

export interface UserInfo {
  name?: string;
  email?: string;
  github?: string;
  slogan?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  bannerUrl: string;
  category: Category;
  tags: Tag[];
  createdAt: string;
}

export interface ModuleContent {
  articleIds?: string[];
  imageUrls?: string[];
  articles?: Article[];
}

export type ModuleType = 'POST_LIST' | 'PHOTO_GALLERY';

export interface PageModule {
  id: string;
  title: string;
  type: ModuleType;
  intro: string;
  styleType: string;
  sortOrder: number;
  content: ModuleContent;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomeData {
  user: UserInfo;
  pageModule: PageModule[];
}

// --- 请求函数 ---

/**
 * 获取首页聚合数据
 * 对应文档：HomeController_getHomeData
 */
export const getHomeData = (): Promise<HomeData> => {
  return request.get<HomeData>('/api/blog/home');
};
