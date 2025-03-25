import { useState } from "react";
import axios from "axios";
import BASE_URL from "../services/api"; 
import "../css/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isProfessor, setIsProfessor] = useState(false);
    
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try 
        {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                username,
                email,
                password
            });

            setMessage(response.data.message);
            localStorage.setItem("token", response.data.token);
        } 
        catch (error) {
            setMessage("Eroare la autentificare: " + (error.response?.data.message || "Server error"));
            alert(message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
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