import React from 'react';
import '../css/StudentAssignmentView.css'; // optional CSS file

function StudentAssignmentView() {
  const assignments = [
    { id: 1, name: "Math Homework 1", grade: "7" },
    { id: 2, name: "History Paper", grade: "10" }
  ];

  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">Assignment Scores</h2>
      <ul className="assignment-list">
        {assignments.map(a => (
          <li key={a.id} className="assignment-item">
            <strong>{a.name}</strong> — Grade: {a.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentAssignmentView;