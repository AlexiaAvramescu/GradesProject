import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSession } from '../context/sessionContext'; // or wherever your session is
import '../css/StudentAssignmentView.css';


function StudentAssignmentView() {
  const [subjects, setSubjects] = useState([]);
  const [searchParams] = useSearchParams();
  const { user } = useSession() || {};
  
  const studentId = user?.id || searchParams.get('studentId') || 1;
  const classId = searchParams.get('classId') || 2;

  useEffect(() => {
    console.log("list");  // Acesta va loga data după ce a fost setată
    console.log(subjects);
  }, [subjects]);

  useEffect(() => {
    const fetchAllSubjects = async () => {
      const response = await fetch(`http://localhost:5000/student/subjects?studentId=${studentId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
      console.log(data)

      setSubjects(data['averages']);
    }

    fetchAllSubjects();
  }, [  ]);


  

  return (
    <div className="averages-div">
      <h1>Subjects</h1>
      <div>
        {Object.entries(subjects).map(([subject,average]) => (
          <div key={subject}>
            {subject}: {average}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentAssignmentView;