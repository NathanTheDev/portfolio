import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";

const Pages = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
};

export default Pages;