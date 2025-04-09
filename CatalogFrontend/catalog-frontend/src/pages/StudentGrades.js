import React, { useEffect, useState } from 'react';
import '../css/StudentAssignmentView.css';

function StudentGrades() {
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/student/all-class-averages', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAverages(data);
        } else {
          setAverages([]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">All Grades</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Average Grade</th>
          </tr>
        </thead>
        <tbody>
          {averages.map((item, idx) => (
            <tr key={idx}>
              <td>{item.subjectName}</td>
              <td>{item.averageGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentGrades;