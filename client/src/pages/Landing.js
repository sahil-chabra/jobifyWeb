import { useNavigate } from "react-router-dom";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";
const Landing = () => {
  const navigate = useNavigate();
  const LandingPage = (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>Tracking</span>App
          </h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus
            culpa qui id excepturi cupiditate dolore possimus! Soluta recusandae
            vitae, debitis ullam impedit deserunt hic aliquam, corporis ipsam
            maxime eaque magnam!
          </p>
          <button className="btn" onClick={() => navigate("/register")}>
            Login/Register
          </button>
        </div>
        <img src={main} alt="main" className="main-img" />
      </div>
    </Wrapper>
  );
  return LandingPage;
};
export default Landing;
