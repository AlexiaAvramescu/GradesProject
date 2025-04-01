import React, { useState } from 'react';
import '../css/Dialog.css';

function CreateAssignmentDialog({ subjectId, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!title) {
      alert("Title is required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId, title, description })
      });

      if (!response.ok) throw new Error('Failed to create assignment');
      const newAssignment = await response.json();
      onCreated(newAssignment);
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment.');
    }
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">

        <h3>Create Assignment</h3>
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="dialog-buttons">
          <button className="action-btn" onClick={handleSubmit}>Create</button>
          <button className="action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignmentDialog;
