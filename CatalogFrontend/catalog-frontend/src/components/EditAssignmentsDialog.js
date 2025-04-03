import React, { useState } from 'react';
import '../css/TeacherClassView.css';

function EditAssignmentsDialog({ assignment, onClose, onUpdate }) {
  const [edited, setEdited] = useState({ ...assignment });

  const handleChange = (field, value) => {
    setEdited((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/assignments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: edited.id,
          title: edited.title,
          description: edited.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      const updatedAssignment = await response.json();
      onUpdate(updatedAssignment); // Update in parent
      onClose(); // Close dialog
    } catch (err) {
      console.error('Error updating assignment:', err);
      alert('Failed to save changes.');
    }
  };

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>Edit Assignment</h3>
        <input
          type="text"
          value={edited.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <textarea
          value={edited.description}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{ width: '100%', marginTop: '4px' }}
        />
        <div className="dialog-buttons">
          <button className="action-btn" onClick={handleSave}>Save</button>
          <button className="action-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditAssignmentsDialog;
