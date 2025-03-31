// src/pages/TeacherClassView.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RemoveStudentsDialog from '../components/RemoveStudentsDialog';
import AddStudentsDialog from '../components/AddStudentsDialog';
import '../css/TeacherClassView.css';

function TeacherClassView() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]); // stores student IDs
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/subjects/students?classId=${classId}`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data.map((s) => ({ id: s.id, name: s.name })));
      } catch (error) {
        console.error('Error loading students:', error);
      }
    };

    fetchStudents();
  }, [classId]);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/students');
        if (!response.ok) throw new Error('Failed to fetch all students');
        const data = await response.json();
        setAllStudents(data.map((s) => ({ id: s.id, name: s.name })));
      } catch (error) {
        console.error('Error loading all students:', error);
      }
    };

    fetchAllStudents();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setCheckedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleRemoveStudents = async () => {
    const teacherId = 1;
    const subjectId = 3;
    const studentIds = Array.isArray(checkedStudents) ? checkedStudents : [checkedStudents];


    try {
      const response = await fetch('http://localhost:5000/subjects/remove-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, subjectId, studentIds })
      });

      if (!response.ok) throw new Error(response.body);
      const data = await response.json();
      const updated = students.filter((s) => !studentIds.includes(s.id));
      setStudents(updated);
      setCheckedStudents([]);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error removing students:', error);
      alert(error);
    }
  };

  const handleAddStudents = async () => {
    const teacherId = 1;
    const subjectId = 3;
    const studentIds = selectedToAdd.map((s) => s.id);

    try {
      const response = await fetch('http://localhost:5000/subjects/enroll-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, subjectId, studentIds })
      });

      if (!response.ok) throw new Error('Failed to enroll students');
      const data = await response.json();
      const newStudents = selectedToAdd.filter(
        (s) => !students.find((existing) => existing.id === s.id)
      );
      setStudents([...students, ...newStudents]);
      setSelectedToAdd([]);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error enrolling students:', error);
      alert('Failed to enroll students');
    }
  };

  return (
    <div className="classview-container">
      <div className="classview-wrapper">
        <h2 className="classview-title">Class {classId}</h2>
        <p className="classview-description">Class details here</p>

        <div className="info-row">
          <div className="student-list-container">
            <div className="list-header">
              <label className="select-all-checkbox">
                <input
                  type="checkbox"
                  checked={checkedStudents.length === students.length}
                  onChange={() => {
                    const allSelected = checkedStudents.length === students.length;
                    setCheckedStudents(allSelected ? [] : students.map((s) => s.id));
                  }}
                />
              </label>
              <h3>Students</h3>
            </div>

            <div className="student-list">
              {students.map((student) => (
                <label className="student-card" key={student.id}>
                  <input
                    type="checkbox"
                    checked={checkedStudents.includes(student.id)}
                    onChange={() => handleCheckboxChange(student.id)}
                  />
                  <span>{student.name}</span>
                </label>
              ))}
            </div>

            <div className="student-actions">
              <button
                className="action-btn"
                onClick={() => {
                  if (checkedStudents.length > 0) setShowConfirmDialog(true);
                }}
              >
                Remove Students from Class
              </button>
              <button
                className="action-btn"
                onClick={() => setShowAddDialog(true)}
              >
                Add Students to Class
              </button>
              <button className="action-btn">Add Grade</button>
            </div>

            <RemoveStudentsDialog
              visible={showConfirmDialog}
              students={students.filter((s) => checkedStudents.includes(s.id))}
              onCancel={() => setShowConfirmDialog(false)}
              onConfirm={handleRemoveStudents}
            />

            <AddStudentsDialog
              visible={showAddDialog}
              allStudents={allStudents}
              currentStudents={students.map((s) => s.id)}
              selectedToAdd={selectedToAdd}
              onSelect={(student) => {
                setSelectedToAdd((prev) =>
                  prev.find((s) => s.id === student.id)
                    ? prev.filter((s) => s.id !== student.id)
                    : [...prev, student]
                );
              }}
              onCancel={() => {
                setSelectedToAdd([]);
                setShowAddDialog(false);
              }}
              onConfirm={handleAddStudents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherClassView;
