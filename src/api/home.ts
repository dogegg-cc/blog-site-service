import { request } from './request';

// --- 数据模型定义 ---

export interface UserInfo {
  name?: string;
  email?: string;
  github?: string;
  slogan?: string;
  avatarItem?: PhotoItemDto;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PhotoMetadataDto {
  // 图片中等路径
  mediumUrl: string;
  // 图片缩略图路径
  thumbnailUrl: string;
}

export interface PhotoItemDto {
  // 图片id
  id: string;
  // 图片原始路径
  originalUrl: string;
  // 图片元数据
  metadata?: PhotoMetadataDto | null;
  // 图片高度
  height: number;
  // 图片宽度
  width: number;
  // 图片比例
  ratio: number;
  // 图片类型
  mimetype: string;
  // 创建时间
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  bannerItem?: PhotoItemDto;
  category: Category;
  tags: Tag[];
  createdAt: string;
}

export interface ModuleContent {
  articleIds?: string[];
  photoIds?: string[];
  articles?: Article[];
  photoItems?: PhotoItemDto[];
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
