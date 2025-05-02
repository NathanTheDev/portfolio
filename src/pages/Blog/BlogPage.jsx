import { useParams } from "react-router-dom"

const BlogPage = () => {
  const { title } = useParams();

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default BlogPage;