import React, { useState } from "react";
import '../css/Account.css';
import { useSession } from '../context/sessionContext';
import ChangePasswordDialog from "../components/ChangePasswordDialog"

function Account() {

  const { user } = useSession();
  const { login } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const email = user.email;
  const role = user.role;
  
  const [showDialog, setShowDialog] = useState(false);

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/changeUsername', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName,  mail: email, isTeacher: role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to change username", data.message);
      }
      else {
        setIsEditing(false);
        login({ name: newName, email: user.email, role: user.role });
      }



    }
    catch (error) {
      throw (error);
    }
  };
  const handleSavePassword = async (oldPassword, newPassword) => {
    console.log(oldPassword);
    setShowDialog(false);
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="account-container">
      <h2 className="account-title">Detalii Cont</h2>
      <div className="account-info">
        <p>
          <strong>Nume:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          ) : (
            user.name
          )}
        </p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Rol:</strong> {role === true ? "Profesor" : "Student"}</p>
      </div>
      <div className="buttons">
        {isEditing ? (
          <button onClick={handleSaveClick} className="edit-button">
            Salvează
          </button>
        ) : (
          <button onClick={handleEditClick} className="edit-button">
            Editează
          </button>
        )}
        <button onClick={() => setShowDialog(true)} className="edit-button">
          Editează parola
        </button>
        {showDialog && (
          <ChangePasswordDialog
            onSave={handleSavePassword}
            onCancel={() => setShowDialog(false)}
          />
        )}
      </div>
    </div>

  );
}


export default Account;