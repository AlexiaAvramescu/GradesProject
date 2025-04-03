import "../css/FirstPage.css";
import { useNavigate } from 'react-router-dom';

function FirstPage() {
    const navigate = useNavigate();
    return (
        <div className="first-page">
            <h1>Welcome</h1>
            <button onClick={() => navigate("/login")}>
                Login
            </button>
            <button onClick={() => navigate("/register")}>
                SignIn
            </button>
        </div>
    );
}

export default FirstPage;