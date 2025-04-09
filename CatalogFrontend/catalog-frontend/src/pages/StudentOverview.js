import React, { useState, useEffect } from 'react';
import { useSession } from '../context/sessionContext';

function StudentOverview() {
  const { user } = useSession() || {};
  const [history, setHistory] = useState([]);
  const [overallAverage, setOverallAverage] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!user?.id) {
        console.log('User ID missing:', user);
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/student/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch overview');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setHistory(data);

          // Calculate subject averages
          const subjectMap = new Map();
          data.forEach((item) => {
            if (!subjectMap.has(item.subjectName)) {
              subjectMap.set(item.subjectName, []);
            }
            subjectMap.get(item.subjectName).push(item.grade);
          });

          const subjectAverages = Array.from(subjectMap.values()).map((grades) => {
            const sum = grades.reduce((acc, g) => acc + g, 0);
            return sum / grades.length;
          });
          const total = subjectAverages.reduce((acc, avg) => acc + avg, 0);
          setOverallAverage((total / subjectAverages.length).toFixed(2));
        } else {
          setHistory([]);
          setOverallAverage(null);
        }
      } catch (error) {
        console.error('Error fetching overview:', error);
      }
    };

    fetchOverview();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h2>Overview</h2>
      {history.length === 0 ? (
        <p>No graded assignments found.</p>
      ) : (
        <>
          <h3>Overall Average: {overallAverage}</h3>
          <h2>Grade History</h2>
          {history.map((item, idx) => (
            <div key={idx} className="class-card">
              <p>Assignment: {item.assignmentTitle}</p>
              <p>Subject: {item.subjectName}</p>
              <p>Grade: {item.grade}</p>
              <p>Date: {item.dateCreated}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default StudentOverview;