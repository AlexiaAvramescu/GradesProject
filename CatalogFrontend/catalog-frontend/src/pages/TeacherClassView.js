// src/pages/TeacherClassView.js
import React, { useState }from 'react';
import { useParams, Link } from 'react-router-dom';
import RemoveStudentsDialog from '../components/RemoveStudentsDialog';
import AddStudentsDialog from '../components/AddStudentsDialog';

import '../css/TeacherClassView.css';

const classes = [
  {
    id: 'math101',
    name: 'Mathematics 101',
    description: 'Basic algebra and geometry',
    students: ['Alice Popescu', 'George Ionescu', 'Maria Enache'],
    assignments: ['Algebra Worksheet', 'Geometry Quiz', 'Midterm Exam']
  },
  {
    id: 'phys201',
    name: 'Physics 201',
    description: 'Mechanics and waves',
    students: ['Vlad Radu', 'Elena Marinescu'],
    assignments: ['Lab Report 1', 'Force and Motion Quiz']
  },
  {
    id: 'hist301',
    name: 'History 301',
    description: 'Modern European history',
    students: ['Diana Tudor', 'Andrei Nistor', 'Simona Rădulescu'],
    assignments: ['Essay: WW1', 'Timeline Project']
  }
];

const allStudents = [
    'Alice Popescu', 'George Ionescu', 'Maria Enache',
    'Vlad Radu', 'Elena Marinescu',
    'Diana Tudor', 'Andrei Nistor', 'Simona Rădulescu',
    'Ioana Dobre', 'Rares Mihai', 'Alex Stoica' // extra example students
  ];
  

function TeacherClassView() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedToAdd, setSelectedToAdd] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { classId } = useParams();
    const selectedClass = classes.find((c) => c.id === classId);
    const [checkedStudents, setCheckedStudents] = useState([]);
  
    if (!selectedClass) {
      return <p>Class not found.</p>;
    }
  
    const handleCheckboxChange = (studentName) => {
      setCheckedStudents((prev) =>
        prev.includes(studentName)
          ? prev.filter((name) => name !== studentName) // uncheck
          : [...prev, studentName] // check
      );
    };
  
    return (
      <div className="classview-container">
        <div className="classview-wrapper">
          <h2 className="classview-title">{selectedClass.name}</h2>
          <p className="classview-description">{selectedClass.description}</p>
  
          <div className="info-row">
            {/* Students container */}
            <div className="student-list-container">
                <div className="list-header">
                    <label className="select-all-checkbox">
                    <input
                        type="checkbox"
                        checked={checkedStudents.length === selectedClass.students.length}
                        onChange={() => {
                        const allSelected = checkedStudents.length === selectedClass.students.length;
                        setCheckedStudents(allSelected ? [] : [...selectedClass.students]);
                        }}
                    />
                    </label>
                    <h3>Students</h3>
                </div>

                <div className="student-list">
                    {selectedClass.students.map((student, index) => (
                    <label className="student-card" key={index}>
                        <input
                        type="checkbox"
                        checked={checkedStudents.includes(student)}
                        onChange={() => handleCheckboxChange(student)}
                        />
                        <span>{student}</span>
                    </label>
                    ))}
                </div>
                <div className="student-actions">
                    <button
                        className="action-btn"
                        onClick={() => {
                                if (checkedStudents.length > 0) {
                                setShowConfirmDialog(true);
                                }
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
                    students={checkedStudents}
                    onCancel={() => setShowConfirmDialog(false)}
                    onConfirm={() => {
                        const updated = selectedClass.students.filter((s) => !checkedStudents.includes(s));
                        selectedClass.students = updated;
                        setCheckedStudents([]);
                        setShowConfirmDialog(false);
                    }}
                    />

                <AddStudentsDialog
                    visible={showAddDialog}
                    allStudents={allStudents}
                    currentStudents={selectedClass.students}
                    selectedToAdd={selectedToAdd}
                    onSelect={(name) => {
                        setSelectedToAdd((prev) =>
                        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
                        );
                    }}
                    onCancel={() => {
                        setSelectedToAdd([]);
                        setShowAddDialog(false);
                    }}
                    onConfirm={() => {
                        selectedClass.students.push(...selectedToAdd);
                        setSelectedToAdd([]);
                        setShowAddDialog(false);
                    }}
                    />
            </div>

            
  
          </div>
        </div>
      </div>
    );
  }
  
  export default TeacherClassView;
