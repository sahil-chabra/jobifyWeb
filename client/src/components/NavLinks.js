import links from "../utils/Links";
import { NavLink } from "react-router-dom";

const NavLinks = ({ toggleSideBar }) => {
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, id, path, icon } = link;

        return (
          <NavLink
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            key={id}
            onClick={toggleSideBar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
