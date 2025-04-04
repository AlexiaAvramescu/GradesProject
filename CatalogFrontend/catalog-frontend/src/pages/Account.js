import React, { useState } from "react";
import '../css/Account.css';
import { useSession } from '../context/sessionContext';

function Account() {

  const { user } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [showDialog,setShowDialog ] = useState(false);

  const handleSaveClick = async (e) => { };
  const handleSavePassword = async (e) => { };
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
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role === true ? "Profesor" : "Student"}</p>
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