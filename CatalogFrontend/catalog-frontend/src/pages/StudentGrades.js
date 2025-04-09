import React from 'react';
import '../css/StudentAssignmentView.css'; // or any suitable CSS

function StudentGrades() {
  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">All Grades</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc' }}>Subject</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {/* Example placeholder row */}
          <tr>
            <td>Math</td>
            <td>8.5</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StudentGrades;