import { useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css";

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToAccount = () => {
    navigate("/account");
  };

  // Ascunde butonul pe prima pagină ("/")
  const hideButtonOnPaths = ["/", "/login","/register"];
  const shouldHideButton = hideButtonOnPaths.includes(location.pathname);

  return (
    <nav className="nav-bar">
      <h2 className="logo">Grading</h2>
        {!shouldHideButton && (
          <button className="action-btn" onClick={goToAccount}>
            Account
          </button>
        )}
    </nav>
  );
}

export default NavigationBar;
