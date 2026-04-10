import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// 定义业务响应的基本结构
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 这里可以统一添加 Token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;

    // 焦朋友规定：code 为 1 表示成功，其他均为失败
    if (res.code === 1) {
      // 成功则直接返回数据部分
      // 这里的转型是为了适配 Axios 拦截器的期望返回类型
      return res.data as unknown as AxiosResponse;
    } else {
      // 业务上的报错，抛出 Promise 异常
      const errorMsg = res.message || '网络请求错误';
      console.error(`[API Error] ${errorMsg}`);
      return Promise.reject(new Error(errorMsg));
    }
  },
  (error) => {
    // 处理 HTTP 状态码错误（非 2xx）
    console.error('网络连接异常:', error.message);
    return Promise.reject(error);
  },
);

/**
 * 封装通用请求方法
 * 注意：由于响应拦截器直接返回了 res.data，
 * 类型上需要将 Axios 返回的 Promise<AxiosResponse<ApiResponse<T>>> 转换为 Promise<T>
 */
export const request = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T = unknown>(url: string, params?: any): Promise<T> {
    return service.get(url, { params }) as unknown as Promise<T>;
  },
  post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return service.post(url, data) as unknown as Promise<T>;
  },
  put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return service.put(url, data) as unknown as Promise<T>;
  },
  delete<T = unknown>(url: string): Promise<T> {
    return service.delete(url) as unknown as Promise<T>;
  },
};

export default service;
