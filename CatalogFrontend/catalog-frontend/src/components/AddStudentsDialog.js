// src/components/AddStudentsDialog.js
import React from 'react';
import '../css/TeacherClassView.css';

function AddStudentsDialog({
  visible,
  allStudents,
  currentStudents,
  selectedToAdd,
  onSelect,
  onCancel,
  onConfirm
}) {
  if (!visible) return null;

  const available = allStudents.filter(s => !currentStudents.includes(s));

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>Select students to add to this class:</p>
        <div className="student-list-to-add">
          {available.map((student, index) => (
            <label key={index} className="student-card">
              <input
                type="checkbox"
                checked={selectedToAdd.includes(student)}
                onChange={() => onSelect(student)}
              />
              <span>{student}</span>
            </label>
          ))}
        </div>
        <div className="dialog-buttons">
          <button className="action-btn" onClick={onCancel}>Abandon</button>
          <button className="action-btn" onClick={onConfirm}>Add to Class</button>
        </div>
      </div>
    </div>
  );
}

export default AddStudentsDialog;
