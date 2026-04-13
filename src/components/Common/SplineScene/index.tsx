import React from 'react';
import styles from './style.module.less';

interface SplineSceneProps {
  /** 场景文件路径 */
  scene: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 封装的 Spline 3D 场景组件
 * 使用 CDN 引入的 Web Component (spline-viewer) 以减小打包体积
 */
export const SplineScene: React.FC<SplineSceneProps> = ({
  scene,
  className = '',
}) => {
  return (
    <div className={`${styles.splineContainer} ${className}`}>
      {/* @ts-expect-error - spline-viewer 是通过 CDN 引入的 Web Component */}
      <spline-viewer url={scene} />
    </div>
  );
};
