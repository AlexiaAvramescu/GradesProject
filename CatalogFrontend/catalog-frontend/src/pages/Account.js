import React, { useEffect, useState } from "react";
import '../css/Account.css';
import { useSession } from '../context/sessionContext';

function Account() {

  //const [username, setUser] = useState("");
 // const [mail, setEmail] = useState("");
  //const [isTeacher, setIsTeacher] = useState(false);
  const { user } = useSession();

  

  return (
    <div className="account-container">
      <h2 className="account-title">Detalii Cont</h2>
      <div className="account-info">
        <p><strong>Nume:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role === true ? "Profesor" : "Student"}</p>
      </div>
      <button className="edit-button">Editează</button>
    </div>

  );
}


export default Account;