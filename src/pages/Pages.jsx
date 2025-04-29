import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Blog from "./Blog";

const Pages = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </>
  )
};

export default Pages;