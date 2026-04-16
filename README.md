# Blog Site Service

[![Powered by React 19](https://img.shields.io/badge/Powered%20by-React%2019-blue?style=flat-square&logo=react)](https://react.dev/)
[![Built with Vite 8](https://img.shields.io/badge/Built%20with-Vite%208-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Language-TypeScript](https://img.shields.io/badge/Language-TypeScript%206-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

这是一个基于最新 **React 19** 和 **Vite 8** 构建的高性能、动效精美的现代化博客前端项目。项目集成了 Markdown 渲染、复杂视觉动画以及高效的状态管理方案，旨在提供极致的阅读与交互体验。

---

## 🌟 核心特性

- 🚀 **前沿技术栈**: 采用 React 19 和 Vite 8，享受最快的热更新与渲染性能。
- 🎨 **极致视觉体验**: 
    - 集成 **GSAP** & **Framer Motion** 实现细腻的交互动效。
    - 使用 **OGL** 处理高性能 WebGL 渲染/3D 图效。
- 📝 **全能内容展现**:
    - 基于 `react-markdown` 实现全套 GFM 支持。
    - 集成 `react-syntax-highlighter` 提供多语言代码高亮。
- ⚓ **高效状态管理**: 
    - **Zustand**: 轻量级全局状态管理。
    - **TanStack Query (v5)**: 强大的异步数据同步与缓存策略。
- 📱 **响应式与标准**: 遵循 CSS Modules 规范，完美适配多端设备。

---

## 🛠 技术栈详情

| 维度 | 技术选型 |
| --- | --- |
| **核心框架** | React 19 |
| **构建工具** | Vite 8 |
| **编程语言** | TypeScript 6 |
| **路由管理** | React Router v7 |
| **状态管理** | Zustand 5 |
| **数据请求** | Axios + TanStack Query v5 |
| **动效库** | GSAP, Framer Motion, OGL |
| **样式处理** | Less (CSS Modules) |
| **Markdown** | React Markdown + Remark GFM + Rehype Raw |
| **图标库** | Lucide React |

---

## 📂 项目结构

```text
src/
├── api/          # 后端接口定义与 Axios 实例
├── assets/       # 静态资源 (图片、自定义字体等)
├── components/   # 通用 UI 组件 (如 Navigation, Footer 等)
├── hooks/        # 自定义 React Hooks
├── pages/        # 页面组件 (Home, Articles, ArticleDetail)
├── router/       # 路由配置 (React Router v7)
├── stores/       # Zustand 状态仓库
├── styles/       # 全局样式与变量定义
├── utils/        # 工具函数
├── App.tsx       # 根组件
└── main.tsx      # 入口文件
```

---

## 🚀 快速开始

### 环境依赖
- **Node.js**: 建议版本 >= 18.x
- **Package Manager**: npm (建议)

### 安装
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

---

## 配置文件说明

- `.env.development`: 开发环境配置（如 API 基准地址）。
- `.env.production`: 生产环境配置。
- `vite.config.ts`: Vite 构建与插件配置。

---

## 📝 开发规范

为了保持代码的高质量与一致性，请遵循以下规范：

1. **组件开发**:
   - 每个组件应包含其独立的 `.tsx` 和 `.module.less`。
   - 必须定义 `interface Props`。
2. **样式处理**:
   - 使用 **CSS Modules** 防止样式污染。
   - 优先使用项目定义的全局变量或主题色。
3. **TypeScript**:
   - 严禁使用 `any` 类型。
   - 复杂状态逻辑建议使用明确的 Interface。

---
由 **Antigravity** 协助驱动。

<img width="1280" height="4359" alt="1907022fe9b321e5f3da22ba9bbef429" src="https://github.com/user-attachments/assets/2a1e52b3-7c18-4d18-a3c3-699067b084a6" />
<img width="1280" height="2186" alt="4ba09da760ebd73d8dc1f902c868d7ab" src="https://github.com/user-attachments/assets/2beac371-0577-4132-90a9-2aae5083c28f" />
<img width="1280" height="4273" alt="43aa0be02a6f0c448a44aac030beb605" src="https://github.com/user-attachments/assets/41853469-c8ba-4805-951d-f4ff60d406c0" />





