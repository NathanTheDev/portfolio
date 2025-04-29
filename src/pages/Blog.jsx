import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const Blog = () => {
  const [text, setText] = useState("");

  const updateText = () => {
    fetch("/blogs/post1.md")
      .then(res => res.text())
      .then(text => setText(text));
  }

  const navigate = useNavigate();
  return (
    <>
    <button onClick={() => {navigate("/home");}}>
      Go to Home
    </button>
    <h1>Hello Blog</h1>
    <button onClick={updateText}>
      Update text
    </button>
    <div>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
    </div>
    </>
  );
};

export default Blog;