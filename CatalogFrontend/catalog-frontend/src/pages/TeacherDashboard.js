import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TeacherDashboard.css';
import AddClassDialog from '../components/AddClassDialog';

export const classes = [
  { id: 'math101', name: 'Mathematics 101', description: 'Basic algebra and geometry' },
  { id: 'phys201', name: 'Physics 201', description: 'Mechanics and waves' },
  { id: 'hist301', name: 'History 301', description: 'Modern European history' }
];

function TeacherDashboard() {
  const navigate = useNavigate();
  const [classList, setClassList] = useState(classes);
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = (id) => {
    navigate(`/class/${id}`);
  };


  const handleAddClass = async (name) => {
    try {
      const response = await fetch('http://localhost:5000/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add class');
      }
  
      const newClass = await response.json();
  
      setClassList([...classList, {
        id: newClass.id,
        name: newClass.name,
      }]);
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to add class:', error);
      alert('Could not add class.');
    }
  };
  

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Teacher Dashboard</h2>
      <div className="class-list">
        {classList.map((cls) => (
          <div key={cls.id} className="class-card" onClick={() => handleClick(cls.id)}>
            <h3>{cls.name}</h3>
            <p>{cls.description}</p>
          </div>
        ))}
      </div>

      <button className="action-btn" style={{ marginTop: '20px' }} onClick={() => setShowDialog(true)}>
        Add Class
      </button>

      {showDialog && (
        <AddClassDialog
          onAdd={handleAddClass}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default TeacherDashboard;
