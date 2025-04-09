import React, { useState, useEffect } from 'react';
import { useSession } from '../context/sessionContext';

function StudentOverview() {
  const { user } = useSession() || {};
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      console.log('User ID missing:', user);
      return;
    }
    // Use the endpoint /student/all-grades to fetch all graded assignments
    fetch(`http://localhost:5000/student/all-grades`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Overview</h2>
      <h2>Grade History</h2>
      {history.map((item, idx) => (
        <div key={idx} className="class-card">
          <p>Assignment: {item.assignmentTitle}</p>
          <p>Subject: {item.subjectName}</p>
          <p>Grade: {item.grade}</p>
          <p>Date: {item.dateCreated}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentOverview;