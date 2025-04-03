import React, { useState } from 'react';
import '../css/Dialog.css';

function AddGradeDialog({ assignmentId, studentIds, onClose, onGradeSubmitted }) {
  const [grade, setGrade] = useState('');

  const handleSubmit = async () => {
    if (!grade) {
      alert("Please enter a grade.");
      return;
    }

    onGradeSubmitted(grade);
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>Add Grade</h3>
        <input
          type="number"
          placeholder="Enter Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <div className="dialog-buttons">
          <button className="action-btn" onClick={handleSubmit}>Submit</button>
          <button className="action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddGradeDialog;
