import React from 'react';
import Spline from '@splinetool/react-spline';
import styles from './style.module.less';

interface SplineSceneProps {
  /** 场景文件路径 */
  scene: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 封装的 Spline 3D 场景组件
 * 修复了 Application 接口冲突并恢复了组件结构。
 */
export const SplineScene: React.FC<SplineSceneProps> = ({
  scene,
  className = '',
}) => {
  return (
    <div className={`${styles.splineContainer} ${className}`}>
      <Spline scene={scene} />
    </div>
  );
};
