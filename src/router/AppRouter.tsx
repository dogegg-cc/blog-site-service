import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home/index';
import Articles from '@/pages/Articles/index';
import ArticleDetail from '@/pages/ArticleDetail/index';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:id" element={<ArticleDetail />} />
    </Routes>
  );
};
