import { useNavigate, useLocation } from "react-router-dom";
import "../css/NavBar.css";
import { useSession } from '../context/sessionContext';

function NavigationBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useSession();

    const onclickLogo = () => {
        if (!shouldHideButton) {
            if (!user) {
                navigate("/");
            } else if (user.role) {
                navigate("/teacher");
            } else {
                navigate("/student");
            }
        }
    };

    const goToAccount = () => {
        navigate("/account");
    };

    const logoutFunc = () => {
        logout();
        navigate("/");
    };

    // Ascunde butonul pe prima pagină ("/")
    const hideButtonOnPaths = ["/", "/login", "/register"];
    const shouldHideButton = hideButtonOnPaths.includes(location.pathname);

    return (
        <nav className="nav-bar">
            <h2 className="logo" onClick={onclickLogo}>Grading</h2>
            {!shouldHideButton && (
                <div className="nav-items">
                    <button className="nav-action-btn" onClick={goToAccount}>
                        Account
                    </button>
                    <button className="nav-action-btn" onClick={logoutFunc}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default NavigationBar;
