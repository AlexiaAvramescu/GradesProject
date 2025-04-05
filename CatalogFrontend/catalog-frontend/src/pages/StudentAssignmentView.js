import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '../context/sessionContext'; // or wherever your session is
import '../css/StudentAssignmentView.css';

function StudentAssignmentView() {
  const [assignments, setAssignments] = useState([]);
  const [searchParams] = useSearchParams();
  const { user } = useSession() || {};

  const studentId = user?.id || searchParams.get('studentId') || 1;
  const classId = searchParams.get('classId') || 2;

  useEffect(() => {
    fetch(`http://localhost:5000/student/${studentId}/classes/${classId}/assignments`, {
      credentials: 'include', // important for sending session cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAssignments(data);
        } else {
          setAssignments([]);
        }
      })
      .catch(console.error);
  }, [studentId, classId]);

  return (
    <div className="assignment-view-container">
      <h2 className="assignment-view-title">Assignment Scores</h2>
      {assignments.length === 0 ? (
        <p>No active assignments for you, {user?.name || "Student"}</p>
      ) : (
        <ul className="assignment-list">
          {assignments.map((a) => (
            <li key={a.id} className="assignment-item">
              {a.title} — {a.StudentAssignment?.grade ?? 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAssignmentView;