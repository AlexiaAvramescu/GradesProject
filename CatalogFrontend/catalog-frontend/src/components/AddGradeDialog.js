import React, { useState } from 'react';
import '../css/Dialog.css';

function AddGradeDialog({ assignmentId, studentIds, onClose, onGradeSubmitted }) {
  const [grade, setGrade] = useState('');

  const handleSubmit = async () => {
    if (!grade) {
      alert("Please enter a grade.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, studentIds, grade })
      });

      if (!response.ok) throw new Error('Failed to submit grade');
      const result = await response.json();
      onGradeSubmitted(result);
    } catch (err) {
      console.error(err);
      alert('Failed to submit grade.');
    }
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
