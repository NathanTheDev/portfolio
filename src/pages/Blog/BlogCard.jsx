import { useNavigate } from "react-router-dom";

const BlogCard = ({ title }) => {
  const navigate = useNavigate();

	return (
	  <div onClick={() => {
      navigate(`/blog/${title}`)
    }}>
		  {title}
	  </div>
	);
};

export default BlogCard;