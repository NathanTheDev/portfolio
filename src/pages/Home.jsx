import Cube from "./Cube";

const Home = () => {
	return (
		<>
		  <div className="title">
        <h1>
          Hi, I'm <span>Nathan</span>
        </h1>
      </div>

      <Cube />
    
      <div className="flex-container">
        <a href="#" className="flex-button">
          About Me
        </a>
        <a href="https://github.com/NathanTheDev" target="_blank" className="flex-button">
          Projects
        </a>
        <a href="mailto:nathan-s-dev@outlook.com" className="flex-button">
          Contact Me
        </a>
		  </div>
		</>
	  );
};

export default Home;