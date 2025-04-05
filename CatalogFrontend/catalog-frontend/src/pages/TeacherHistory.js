import React from 'react';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';

const TeacherHistory = () => {
  // Sample data array
  const data = [
    ['Math 101', 'Algebra Assignment', 'John Doe', 'A', '2025-03-15'],
    ['Science 202', 'Chemistry Lab', 'Jane Smith', 'B+', '2025-03-16'],
    // Add more records as needed
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher History</h2>
      <Grid
        data={data}
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
