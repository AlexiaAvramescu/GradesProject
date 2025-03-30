// src/components/RemoveStudentsDialog.js
import React from 'react';
import '../css/TeacherClassView.css';

function RemoveStudentsDialog({ visible, students, onCancel, onConfirm }) {
  if (!visible) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>Are you sure you want to remove the following students?</p>
        <ul>
          {students.map((name, index) => (
            <li key={index}>{name}</li>
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
