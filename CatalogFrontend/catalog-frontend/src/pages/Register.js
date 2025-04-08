import React, { useState } from "react";
import "../css/Register.css";
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/sessionContext';

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isTeacher, setIsTeacher] = useState(false);
    const [error, setError] = useState("");
    const { login } = useSession();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, isTeacher })
            });
            //alert(response.ok);
            //if (!response.ok) throw new Error(response.body);
            const data=await response.json();
            if (!response.ok) {
                setError(data.message); // Extrage textul răspunsului
                //throw new Error(errorText);
            }
            else
            if(isTeacher===true)
            {
                login({id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role });
                navigate(`/teacher`);
            }
            else if(isTeacher===false)
            {
                login({id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role });
                navigate(`/student`);
                //alert("Conectat pe pagina de student");
            }
        }
        catch (error) {
            throw(error);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleLogin}>
                <h1>Register</h1>
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
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <div className="toggle-container">
                    <input
                        type="checkbox"
                        checked={isTeacher}
                        onChange={() => setIsTeacher(!isTeacher)}
                    />
                    <label>Sunt profesor</label>
                </div>
                {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
                <button type="submit">SignIn</button>
            </form>
        </div>
    );

}
export default Register;