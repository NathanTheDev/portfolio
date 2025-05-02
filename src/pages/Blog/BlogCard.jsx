import { useNavigate } from "react-router-dom";

const BlogCard = ({ title, description }) => {
  const navigate = useNavigate();

	return (
		<div onClick={() => {
      navigate(`/blog/${title}`)
    }} className="p-6 border border-gray-800 bg-[#2E333C] rounded-lg shadow-sm hover:bg-[#393E46] hover:cursor-pointer">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 bg-[#00ADB5] rounded-sm" />
        <h5 className="text-2xl font-bold text-[#EEEEEE]">{title}</h5>
      </div>
			<p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
		</div>
	);
};

export default BlogCard;