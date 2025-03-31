// src/components/AddClassDialog.js
import React, { useState } from 'react';
import '../css/TeacherClassView.css'; // reuse existing dialog style

function AddClassDialog({ onAdd, onCancel }) {
  const [className, setClassName] = useState('');

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>Enter the name of the new class:</p>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class name"
          style={{ padding: '8px', width: '100%', margin: '10px 0', borderRadius: '6px' }}
        />
        <div className="dialog-buttons">
          <button className="action-btn" onClick={onCancel}>Cancel</button>
          <button
            className="action-btn"
            onClick={() => {
              if (className.trim()) {
                onAdd(className.trim());
                setClassName('');
              }
            }}
          >
            Add Class
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddClassDialog;
