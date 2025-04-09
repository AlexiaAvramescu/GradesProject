import React, { useState, useEffect } from 'react';
import { useSession } from '../context/sessionContext';
//import Student from '../../../catalog-backend/models/Student';

function StudentOverview() {
  const { user } = useSession() || {};
  const [history, setHistory] = useState([]);


  useEffect(() => {

    const fetchAllStudentGrades = async () => {

      if (!user) {
        console.log('User ID missing:', user);
        return;
      }

      const studentId = user.id;
      const response = await fetch(`http://localhost:5000/student/all-grades?studentId=${studentId}`);


      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      setHistory(data);
      console.log(history);
    }
 

    fetchAllStudentGrades();
  }, []);
  let historyElements = [];
  for (let i = 0; i < history.length; i++) {
    let item = history[i];
    const assignment =item.Assignment;
    historyElements.push(
  <div className="class-card">
          <p>Assignment: {assignment.title}</p>
          <p>Grade: {item.grade} </p>
          <p>Subject: {assignment.Subject.name} </p>
        </div>
    );
  }
  return (
    <div className="dashboard-container">
      <h2>Grade History</h2>
      {historyElements}
    </div>
  );
}

export default StudentOverview;