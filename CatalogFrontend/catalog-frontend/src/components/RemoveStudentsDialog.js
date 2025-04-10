// src/components/RemoveStudentsDialog.js
import React from 'react';
import '../css/Dialog.css';

function RemoveStudentsDialog({ visible, students, onCancel, onConfirm }) {
  if (!visible) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>Are you sure you want to remove the following students?</p>
        <ul>
          {students.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
        <div className="dialog-buttons">
          <button className="action-btn" onClick={onConfirm}>Yes</button>
          <button className="action-btn" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default RemoveStudentsDialog;
