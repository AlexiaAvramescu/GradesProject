// src/pages/TeacherDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TeacherDashboard.css'; 

export const classes = [
    { id: 'math101', name: 'Mathematics 101', description: 'Basic algebra and geometry' },
    { id: 'phys201', name: 'Physics 201', description: 'Mechanics and waves' },
    { id: 'hist301', name: 'History 301', description: 'Modern European history' }
  ];


function TeacherDashboard() {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/class/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Teacher Dashboard</h2>
      <div className="class-list">
        {classes.map((cls) => (
          <div key={cls.id} className="class-card" onClick={() => handleClick(cls.id)}>
            <h3>{cls.name}</h3>
            <p>{cls.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherDashboard;
