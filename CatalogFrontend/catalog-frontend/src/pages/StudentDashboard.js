import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/sessionContext';
import '../css/StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useSession() || {};
  const [totalAverage, setTotalAverage] = useState()
  const handleClick = (route) => {
    navigate(`/student/${route}`);
  };


  useEffect(() => {
    console.log("list");  // Acesta va loga data după ce a fost setată
    console.log(totalAverage);
  }, [totalAverage]);

  useEffect(() => {

    const fetchTotalAverage = async () => {

      if (!user) {
        console.log('User ID missing:', user);
        return;
      }

      const studentId = user.id;
      const response = await fetch(`http://localhost:5000/student/total-average?studentId=${studentId}`);


      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      setTotalAverage(data);
      console.log(totalAverage);
    }


    fetchTotalAverage();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      <div className="class-list">
        <div className="class-card" onClick={() => handleClick('grades')}>
          <h3>Assignment Scores</h3>
        </div>
        <div className="class-card" onClick={() => handleClick('assignment')}>
          <h3>See All Grades</h3>
        </div>
        <div className="class-card" >
          <h3>Total Average : {totalAverage}</h3>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;