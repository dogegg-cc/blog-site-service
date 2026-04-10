import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home/index'));
const Articles = lazy(() => import('@/pages/Articles/index'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail/index'));

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
    </Routes>
  );
};
