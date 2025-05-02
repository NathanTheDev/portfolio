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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogList.map((blog) => (
          <BlogCard key={blog.text} title={blog.text} description={blog.description} />
        ))}
      </div>
    </div>
  );
};

export default Blog;