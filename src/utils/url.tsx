import type { PhotoItemDto } from '@/api/home';

/**
 * 图片预览基础路径 (建议根据环境变量配置，当前硬编码对应后端地址)
 */
export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 判断当前是否为手机浏览器
 */
export const isMobileBrowser = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

/**
 * 补全图片 URL
 * @param path 后端返回的半路径
 * @returns 完整的图片预览地址
 */
export const getFullImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${IMAGE_BASE_URL}${normalizedPath}`;
};

/**
 * 根据设备类型和优先级获取合适的图片 URL
 * @param photo 图片对象
 * @param priority 优先级 'low' (默认，卡片类) | 'high' (Hero/大图类)
 */
export const getPhotoUrl = (
  photo?: PhotoItemDto | null,
  priority: 'low' | 'high' = 'low',
): string => {
  if (!photo) return '';

  const isMobile = isMobileBrowser();
  let path: string | undefined;

  if (priority === 'high') {
    // 高优先级 (如 Hero): 手机端用中图提高加载速度，桌面端用原图保证画质
    path = isMobile ? photo.metadata?.mediumUrl : photo.originalUrl;
  } else {
    // 低优先级 (如 卡片): 手机端用缩略图，桌面端用中图
    path = isMobile ? photo.metadata?.thumbnailUrl : photo.metadata?.mediumUrl;
  }

  // 如果对应规格的路径不存在，则回退到原始路径
  return getFullImageUrl(path || photo.originalUrl);
};

/**
 * 将 Markdown 内容中的完整图片 URL 替换为半路径
 * 用于提交给服务器时，避免将 host 存入数据库
 * 例: ![](http://localhost:3001/upload/img.jpg) → ![](/upload/img.jpg)
 */
export const contentToHalfPath = (content: string): string => {
  if (!content) return content;
  // 转义 IMAGE_BASE_URL 中的特殊正则字符
  const escaped = IMAGE_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return content.replace(new RegExp(escaped, 'g'), '');
};

/**
 * 将 Markdown 内容中的半路径图片 URL 替换为完整 URL
 * 用于在编辑器中回显时，确保图片能正常加载
 * 例: ![](/upload/img.jpg) → ![](http://localhost:3001/upload/img.jpg)
 * 仅匹配以 / 开头的路径（避免已有完整 URL 被重复处理）
 */
export const contentToFullPath = (content: string): string => {
  if (!content) return content;
  // 匹配 Markdown 图片语法中以 / 开头的半路径
  return content.replace(
    /!\[([^\]]*)\]\((\/[^)]+)\)/g,
    `![$1](${IMAGE_BASE_URL}$2)`,
  );
};
