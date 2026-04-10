import React, { useState, Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { Application } from '@splinetool/runtime';
import styles from './style.module.less';

interface SplineSceneProps {
  /** 场景文件路径 */
  scene: string;
  /** 自定义类名 */
  className?: string;
  /** 相机缩放比例，默认 1.3 */
  zoom?: number;
  /** 场景加载完成的回调 */
  onLoad?: (splineApp: Application) => void;
}

/**
 * 封装的 Spline 3D 场景组件
 * 修复了 Application 接口冲突并恢复了组件结构。
 */
export const SplineScene: React.FC<SplineSceneProps> = ({
  scene,
  className = '',
  zoom = 1.3,
  onLoad,
}) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = (splineApp: Application) => {
    // 1. 自动修正相机显示效果
    try {
      // @splinetool/runtime 的 Application 已包含 setZoom 方法
      if (splineApp && typeof splineApp.setZoom === 'function') {
        splineApp.setZoom(zoom);
      } else {
        const camera =
          splineApp.findObjectByName('Camera') ||
          splineApp.findObjectById('primary-camera');

        if (camera && 'scale' in camera) {
          const scaleObj = camera.scale as { x: number; y: number; z: number };
          scaleObj.x = zoom;
          scaleObj.y = zoom;
          scaleObj.z = zoom;
        }
      }
    } catch (error) {
      console.warn('SplineScene: Failed to auto-adjust camera.', error);
    }

    // 2. 延迟隐藏加载器
    setTimeout(() => {
      setLoading(false);
    }, 150);

    // 3. 执行回调
    if (onLoad) {
      onLoad(splineApp);
    }
  };

  return (
    <div className={`${styles.splineContainer} ${className}`}>
      <div
        className={`${styles.canvasWrapper} ${!loading ? styles.loaded : ''}`}
      >
        <Suspense fallback={null}>
          <Spline scene={scene} onLoad={handleLoad} />
        </Suspense>
      </div>
    </div>
  );
};
