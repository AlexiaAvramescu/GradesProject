// src/components/AddClassDialog.js
import React, { useState } from 'react';
import '../css/TeacherClassView.css'; // reuse existing dialog style

function ChangePasswordDialog({ onSave, onCancel }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <p>Enter the old password: </p>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="old Password"
                    style={{ padding: '8px', width: '100%', margin: '10px 0', borderRadius: '6px' }}
                />
                <p>Enter the new password: </p>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="new Password"
                    style={{ padding: '8px', width: '100%', margin: '10px 0', borderRadius: '6px' }}
                />
                <div className="dialog-buttons">
                    <button className="action-btn" onClick={onCancel}>Cancel</button>
                    <button
                        className="action-btn"
                        onClick={
                            () => {
                                onSave(oldPassword, newPassword);
                                setNewPassword('');
                                setOldPassword('');
                            }} >
                        Save New Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordDialog;
