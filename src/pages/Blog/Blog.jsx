import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import BlogCard from "./BlogCard";

const Blog = () => {
  const [blogList, setBlogList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    updateText();
  }, [])

  useEffect(() => {
    getBlogs();
  }, [])

  const getBlogs = () => {
    fetch("/portfolio/blogs/blogList.json")
      .then(res => res.json())
      .then(list => setBlogList(list));
  }

  const updateText = () => {
    fetch("/portfolio/blogs/post1/post1.md")
      .then(res => res.text())
      .then(text => setText(text));
  }

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
      {/* <div>
        <ReactMarkdown>
          {text}
        </ReactMarkdown>
      </div> */}
    </div>
  );
};

export default Blog;