import React from 'react';

function StudentAssignmentView() {
  // Placeholder data until endpoint is ready
  const assignments = [
    { id: 1, name: "Math Homework 1", grade: "7" },
    { id: 2, name: "History Paper", grade: "10" }
  ];

  return (
    <div>
      <h1>Assignment Scores</h1>
      <ul>
        {assignments.map(a => (
          <li key={a.id}>
            {a.name} - Grade: {a.grade}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentAssignmentView;