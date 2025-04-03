import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(`/student/${route}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <div className="class-list">
        <div className="class-card" onClick={() => handleClick('overview')}>
          <h3>Overview</h3>
        </div>
        <div className="class-card" onClick={() => handleClick('assignment')}>
          <h3>Assignment Scores</h3>
        </div>
        <div className="class-card" onClick={() => handleClick('grades')}>
          <h3>See All Grades</h3>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;