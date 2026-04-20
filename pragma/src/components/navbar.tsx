import { useLocation, useNavigate } from "react-router-dom";
import './navbar.css';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={handleHomeClick}>
        {/* placeholder for logo */}
        <span className="navbar-logo">🌸</span>
        <span className="navbar-title">Pragma</span>
      </div>
    </nav>
  );
};

export default NavBar;