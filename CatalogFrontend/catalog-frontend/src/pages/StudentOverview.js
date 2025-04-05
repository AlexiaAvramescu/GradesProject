import React, { useState, useEffect } from 'react';
import { useSession } from '../context/sessionContext';

function StudentOverview() {
  const { user } = useSession() || {};
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:5000/student/${user.id}/averages`)
      .then((res) => res.json())
      .then((data) => setAverages(data))
      .catch(console.error);
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Overview</h2>
      {averages.map((item) => (
        <div key={item.subjectId} className="class-card">
          <h3>Subject: {item.subjectName}</h3>
          <p>Average Grade: {item.average}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentOverview;