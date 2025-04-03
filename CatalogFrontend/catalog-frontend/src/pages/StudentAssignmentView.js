import React, { useState, useEffect } from 'react';
import '../css/StudentAssignmentView.css';

function StudentAssignmentView() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Replace 1 and 2 with actual IDs
    fetch('http://localhost:5000/student/1/classes/2/assignments')
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">Assignment Scores</h2>
      <ul className="assignment-list">
        {assignments.map((a) => (
          <li key={a.id} className="assignment-item">
            <strong>{a.name}</strong> — Grade: {a.Grade.gradeValue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentAssignmentView;