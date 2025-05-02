import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown";

const BlogPage = () => {
  const { title } = useParams();
  const [text, setText] = useState("");

  useEffect(() => {
    updateText();
  }, []);

  const updateText = () => {
    fetch(`/portfolio/blogs/${title}/${title}.md`)
      .then(res => res.text())
      .then(text => setText(text));
  };

  return (
    <div>
      <ReactMarkdown>
        {text}
      </ReactMarkdown>
      </div>
  );
};

export default BlogPage;