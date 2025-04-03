import React, { useState, useEffect } from 'react';
import '../css/StudentAssignmentView.css';

function StudentAssignmentView() {
  const [assignments, setAssignments] = useState([]);
  const studentId = 1;
  const classId = 2;

  useEffect(() => {
    fetch(`http://localhost:5000/student/${studentId}/classes/${classId}/assignments`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAssignments(data);
        } else {
          console.error("Did not receive an array:", data);
          setAssignments([]);
        }
      })
      .catch((err) => console.error(err));
  }, [studentId, classId]);

  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">Assignment Scores</h2>
      <ul className="assignment-list">
        {assignments.map((a) => (
          <li key={a.id} className="assignment-item">
            <strong>{a.name}</strong> — Grade: {a.Grade?.gradeValue ?? 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentAssignmentView;