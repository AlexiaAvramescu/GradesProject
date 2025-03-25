import { useState } from "react";
import "../css/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isProfessor, setIsProfessor] = useState(false);


    return (
        <div className="login-container">
            <form className="login-form">
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="toggle-container">
                    <input
                        type="checkbox"
                        checked={isProfessor}
                        onChange={() => setIsProfessor(!isProfessor)}
                    />
                    <label>Sunt profesor</label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );

}
export default Login;