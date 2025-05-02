import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Blog from "./Blog/Blog";
import BlogPage from "./Blog/BlogPage";

const Pages = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:title" element={<BlogPage />} />
      </Routes>
    </>
  )
};

export default Pages;