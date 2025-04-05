import React, { useEffect, useState } from 'react';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';


const TeacherHistory = ({ teacherId }) => {
    const [gradesData, setGradesData] = useState([]);
    teacherId = 1;
    useEffect(() => {
      const fetchData = async () => {
        if (!teacherId) {
          console.error('Teacher ID is required');
          return;
        }
  
        try {
          const response = await fetch(`http://localhost:5000/history?teacherId=${teacherId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          const formattedData = data.map(({ className, assignmentName, studentName, grade, dateCreated }) => [
            className,
            assignmentName,
            studentName,
            grade,
            dateCreated,
          ]);
          setGradesData(formattedData);
        } catch (error) {
          console.error('Error fetching grades history:', error);
        }
      };
  
      fetchData();
    }, [teacherId]);
  return (
    
    <div style={{ padding: '20px' }}>
      <h2>Teacher History</h2>
      <Grid
        data={gradesData}
        columns={['Class Name', 'Assignment Name', 'Student Name', 'Grade', 'Date Created']}
        search={true}
        pagination={{
          enabled: true,
          limit: 10,
        }}
        sort={true}
      />
    </div>
  );
};

export default TeacherHistory;
