import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TeacherDashboard.css';
import AddClassDialog from '../components/AddClassDialog';
import { useSession } from '../context/sessionContext'; 

function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [classList, setClassList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const { setClassId } = useSession();
  
  const handleClick = (id) => {
    setClassId(id); 
    localStorage.setItem("classId", JSON.stringify(id)); 
    navigate(`/subject`);
  };
  
  useEffect(() => {
    const teacherId= user.id;
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`http://localhost:5000/subjects?teacherId=${teacherId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }

        const data = await response.json();
        setClassList(data);
      } catch (error) {
        console.error('Error loading classes:', error);
        alert(error)
      }
    };

    fetchSubjects();
  }, []);


  const handleAddClass = async (name) => {
    const teacherId= user.id;

    try {
      const response = await fetch('http://localhost:5000/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, teacherId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add class');
      }

      const newClass = await response.json();

      setClassList([...classList, {
        id: newClass.id,
        name: newClass.name,
      }]);
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to add class:', error);
      alert(error);
    }
  };


  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Teacher Dashboard</h2>
      
      <div className="class-list">
        {classList.map((cls) => (
          <div key={cls.id} className="class-card" onClick={() => handleClick(cls.id)}>
            <h3>{cls.name}</h3>
          </div>
        ))}
      </div>

      <button className="action-btn" style={{ marginTop: '20px' }} onClick={() => setShowDialog(true)}>
        Add Class
      </button>
      <button
           className="action-btn"
          onClick={() => window.location.href = "/teacher-history"}
        >
          History
        </button>

      {showDialog && (
        <AddClassDialog
          onAdd={handleAddClass}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default TeacherDashboard;
