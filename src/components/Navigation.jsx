const Navigation = ({ clickFn }) => {
  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white py-4 px-6 flex gap-6 rounded z-50">
      {["Home", "About", "Projects", "Contact", "Resume"].map((label) => (
        <div
          key={label}
          className="cursor-pointer hover:underline transition"
          onClick={() => clickFn(label)}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default Navigation;
