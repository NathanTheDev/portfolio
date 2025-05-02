import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";

const Blog = () => {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = () => {
    fetch("/portfolio/blogs/blogList.json")
      .then(res => res.json())
      .then(list => setBlogList(list));
  };

  const navigate = useNavigate();
  return (
    <div className="blog-container">
      <button onClick={() => {navigate("/home");}}>
        Go to Home
      </button>
      <div>
        {blogList.map((blog) => (
          <BlogCard key={blog} title={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;