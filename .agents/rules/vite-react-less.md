---
trigger: always_on
---

---
name: vite-react-ts-less-dev
description: 专门用于处理 Vite, React 18+, TypeScript 和 Less 的开发任务。包括组件创建、Hooks 编写及样式模块化。
---

# Vite + React + TS + Less 开发规范

当你（Agent）被要求在这个项目中创建或修改代码时，请严格遵守以下技能说明：

## 1. 组件开发规范
- **文件命名**：使用 PascalCase (例如 `MyComponent.tsx`)。
- **目录结构**：每个组件应有自己的文件夹，包含 `index.tsx`（或组件名.tsx）和 `style.module.less`。
- **导出方式**：优先使用具名导出 (Named Export)。
- **类型定义**：
  - 必须定义接口 `interface Props`。
  - 使用 `React.FC<Props>` 或直接在函数参数中解构并标注类型。

## 2. 样式处理 (Less & CSS Modules)
- **模块化**：必须使用 CSS Modules。文件名后缀为 `.module.less`。
- **引入方式**：在 TSX 中使用 `import styles from './style.module.less';`。
- **变量使用**：优先检查 `src/styles/variables.less`（如果存在）中的全局变量或主题色。

## 3. 技术栈特定指令
- **Vite**：静态资源引用需符合 Vite 的路径规则（使用 `@/` 别名，如果配置了的话）。
- **Hooks**：自定义 Hooks 存放在 `src/hooks/` 目录，命名以 `use` 开头。
- **TypeScript**：
  - 严禁使用 `any`。
  - 复杂状态使用 `useReducer` 或定义明确的 `type/interface`。

## 4. 任务执行模板
当用户要求“创建一个新组件”时，请生成如下结构：

### 组件代码示例 (tsx)
```tsx
import React from 'react';
import styles from './style.module.less';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
    </div>
  );
};