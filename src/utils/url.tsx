/**
 * 图片预览基础路径 (建议根据环境变量配置，当前硬编码对应后端地址)
 */
export const IMAGE_BASE_URL = 'http://localhost:3001';

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
