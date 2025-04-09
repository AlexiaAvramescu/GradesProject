import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RemoveStudentsDialog from '../components/RemoveStudentsDialog';
import AddStudentsDialog from '../components/AddStudentsDialog';
import CreateAssignmentDialog from '../components/CreateAssignmentDialog';
import EditAssignmentsDialog from '../components/EditAssignmentsDialog';
import AddGradeDialog from '../components/AddGradeDialog';
import AddGradeInBulk from '../components/AddGradeInBulk';
import { useSession } from '../context/sessionContext';

import '../css/TeacherClassView.css';

function TeacherClassView() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]); // stores student IDs
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showCreateAssignmentDialog, setShowCreateAssignmentDialog] = useState(false);
  const [showEditAssignmentDialog, setShowEditAssignmentDialog] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false);
  const [grades, setGrades] = useState([]);
  const [showEditGradeDialog, setShowEditGradeDialog] = useState(false);
  const [showAddGradeInBulkDialog, setShowAddGradeInBulkDialog] = useState(false);
  const { user } = useSession();
  const { classId } = useSession();
  const [className, setClassName] = useState('');

  useEffect(() => {
    const fetchClassName = async () => {
      if (!classId) return;

      try {
        const response = await fetch(`http://localhost:5000/subjects/${classId}`);
        if (!response.ok) throw new Error('Failed to fetch class name');

        const data = await response.json();
        setClassName(data.name);
      } catch (error) {
        console.error('Error fetching class name:', error);
      }
    };

    fetchClassName();
  }, [classId]);


  const fetchGrades = async () => {
    try {
      if (!selectedAssignmentId) return;

      const response = await fetch(`http://localhost:5000/grades?assignmentId=${selectedAssignmentId}`);
      if (!response.ok) throw new Error('Failed to fetch grades');
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedAssignmentId]); // <-- fetch when this changes

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/assignments?subjectId=${classId}`);
        if (!response.ok) throw new Error('Failed to fetch assignments');
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    };

    fetchAssignments();
  }, [classId]);

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

  const fetchAllStudents = async () => {
    try {
      const response = await fetch(`http://localhost:5000/students/not-in-class?classId=${classId}`);
      if (!response.ok) throw new Error('Failed to fetch students not in class');
      const data = await response.json();
      setAllStudents(data.map((s) => ({ id: s.id, name: s.name })));
    } catch (error) {
      console.error('Error loading students not in class:', error);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, [classId]);

  const handleCheckboxChange = (studentId) => {
    setCheckedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };


  const handleAssignmentChange = (assignmentId) => {
    setSelectedAssignmentId(assignmentId); // <-- triggers useEffect
    setGrades([]); // optional visual reset
  };


  const handleRemoveStudents = async () => {
    const studentIds = Array.isArray(checkedStudents) ? checkedStudents : [checkedStudents];
    const teacherID = user.id;
    try {
      const response = await fetch('http://localhost:5000/subjects/remove-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherID, subjectId: classId, studentIds })
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
    const teacherId = user.id;
    const studentIds = selectedToAdd.map((s) => s.id);

    try {
      const response = await fetch('http://localhost:5000/subjects/enroll-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId, subjectId: classId, studentIds })
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

  const handleShowAddGradeDialog = () => {
    if (selectedAssignmentId && checkedStudents.length > 0) {
      setShowAddGradeDialog(true);
    } else {
      alert("Please select at least one student and an assignment.");
    }
  }

  const handleAddGrade = async (gradeValue) => {
    if (checkedStudents.length === 0 || !selectedAssignmentId) {
      alert("Please select at least one student and an assignment.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignmentId,
          studentIds: checkedStudents,
          grade: gradeValue,
        }),
      });
      if (!response.ok) throw new Error("Failed to add grade");

      setShowAddGradeDialog(false);
      fetchGrades();
    } catch (error) {
      console.error("Error adding grade:", error);
      alert(error);
    }
  };

  const handleDeleteGrade = async () => {
    if (checkedStudents.length !== 1 || !selectedAssignmentId) {
      alert("Please select exactly one student and an assignment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/grades", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignmentId,
          studentIds: [checkedStudents[0]],
        }),
      });

      if (!response.ok) throw new Error("Failed to delete grade");

      alert("Grade deleted successfully");
      fetchGrades();
    } catch (error) {
      console.error("Error deleting grade:", error);
      alert("Error deleting grade.");
    }
  };

  const handleShowEditGradeDialog = () => {
    if (checkedStudents.length !== 1 || !selectedAssignmentId) {
      alert("Please select exactly one student and an assignment.");
      return;
    }

    setShowAddGradeDialog(true);
  }

  const handleEditGrade = async (updatedGrade) => {
    if (checkedStudents.length !== 1 || !selectedAssignmentId) {
      alert("Please select exactly one student and an assignment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/grades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedAssignmentId,
          studentId: checkedStudents[0],
          grade: updatedGrade,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update grade");
      }

      setShowEditGradeDialog(false);

      // Add a small delay to ensure backend commit
      setTimeout(() => {
        fetchGrades(); // ensure re-render
      }, 100);

      alert("Grade updated successfully");
    } catch (error) {
      console.error("Error updating grade:", error);
      alert("Error updating grade.");
    }
  };

  const handleFileSelected = async (file) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.trim().split("\n");

      // Citirea header-ului și găsirea index-urilor
      const header = lines[0].split(",").map(h => h.trim());
      const numeIndex = header.indexOf("nume");
      const notaIndex = header.indexOf("nota");

      // Verificăm dacă există coloanele necesare
      if (numeIndex === -1 || notaIndex === -1) {
        console.error("Fișierul CSV nu conține coloanele necesare (nume, nota)");
        return;
      }

      // Parcurgem fiecare linie și preluăm valorile
      const gradeRequests = lines.slice(1).map(async (line) => {
        const values = line.split(",").map(v => v.trim());
        const studentName = values[numeIndex];
        const grade = values[notaIndex];

        const student = students.find((student) => student.name === studentName);
        if (!student) {
          console.error(`Studentul ${studentName} nu a fost găsit!`);
          return;
        }

        const nameId = [student.id];

        try {

          const response = await fetch("http://localhost:5000/grades", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              assignmentId: selectedAssignmentId,
              studentIds: nameId,
              grade: grade,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Eroare la trimitere:", errorData);
          } else {
            console.log("Cerere trimisă cu succes.");
          }
        } catch (error) {
          console.error("Eroare la trimitere:", error);
        }
      });

      // Așteptăm să se finalizeze toate cererile de trimitere
      await Promise.all(gradeRequests);

      setShowAddGradeInBulkDialog(false);
      fetchGrades();
    };

    reader.readAsText(file);
  };


  // The rest of the render logic remains unchanged
  // ... (as already in your original component)

  return (
    <div className="classview-container">
      <div className="classview-wrapper">
        <h2 className="classview-title">{className} </h2>
        <p cassName="classview-description">ClassID: {classId}</p>
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
              {students.map((student) => {
                const studentGrade = grades.find(
                  g => { return g.studentId === student.id && g.assignmentId === selectedAssignmentId })


                return (
                  <label className="student-card" key={student.id}>
                    <div className="student-left">
                      <input
                        type="checkbox"
                        checked={checkedStudents.includes(student.id)}
                        onChange={() => handleCheckboxChange(student.id)}
                      />
                      <span className="student-name">{student.name}</span>
                    </div>
                    <span className="student-grade">
                      {selectedAssignmentId ? (studentGrade ? studentGrade.grade : "N/A") : ""}
                    </span>
                  </label>
                );
              })}
            </div>


            <div className="student-actions">
              <div className="student-actions">
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
                    onClick={handleShowAddGradeDialog}
                  >
                    Add Grade
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => { fetchAllStudents(); setShowAddDialog(true); }}
                  >
                    Add Students to Class
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => {
                      if (selectedAssignmentId)
                        setShowAddGradeInBulkDialog(true)
                      else
                        alert("You need to select an assignmnet")
                    }} >
                    Add Grades in Bulk
                  </button>

                  <button
                    className="action-btn"
                    onClick={handleDeleteGrade}
                    disabled={checkedStudents.length !== 1 || !selectedAssignmentId}
                  >
                    Delete Grade
                  </button>

                  <button
                    className="action-btn"
                    onClick={handleShowEditGradeDialog}
                    disabled={checkedStudents.length !== 1 || !selectedAssignmentId}
                  >
                    Update Grade
                  </button>
                </div>

              </div>
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

            {showAddGradeDialog && (
              <AddGradeDialog
                assignmentId={selectedAssignmentId}
                studentIds={checkedStudents}
                onClose={() => setShowAddGradeDialog(false)}
                onGradeSubmitted={handleAddGrade}
              />
            )}


            <AddGradeInBulk
              open={showAddGradeInBulkDialog}
              onClose={() => setShowAddGradeInBulkDialog(false)}
              onFileSelected={handleFileSelected}
            />

            {showEditGradeDialog && (
              <AddGradeDialog
                assignmentId={selectedAssignmentId}
                studentIds={checkedStudents}
                onClose={() => setShowEditGradeDialog(false)}
                title="Update Grade"
                onGradeSubmitted={handleEditGrade}
              />
            )}

          </div>

          <div className="student-list-container">
            <h3>Assignments</h3>
            <div className="assignment-list">
              {assignments.map((assignment) => (
                <div className="assignment-card" key={assignment.id}>
                  <input
                    type="radio"
                    name="assignment"
                    className="assignment-radio"
                    checked={selectedAssignmentId === assignment.id}
                    onChange={() => handleAssignmentChange(assignment.id)}
                  />
                  <div className="assignment-text">
                    <div className="assignment-title">{assignment.title}</div>
                    <div className="assignment-description">{assignment.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="student-actions" style={{ marginTop: '10px' }}>
              <button className="action-btn" onClick={() => setShowCreateAssignmentDialog(true)}>
                + Create Assignment
              </button>
              <button className="action-btn" onClick={() => setShowEditAssignmentDialog(true)}>
                ✎ Edit Assignments
              </button>
            </div>

            {showCreateAssignmentDialog && (
              <CreateAssignmentDialog
                subjectId={classId}
                onClose={() => setShowCreateAssignmentDialog(false)}
                onCreated={(newAssignment) => {
                  setAssignments((prev) => [...prev, newAssignment]);
                  setShowCreateAssignmentDialog(false);
                }}
              />
            )}

            {showEditAssignmentDialog && selectedAssignmentId && (
              <EditAssignmentsDialog
                assignment={assignments.find((a) => a.id === selectedAssignmentId)}
                onClose={() => setShowEditAssignmentDialog(false)}
                onUpdate={(updatedAssignment) => {
                  setAssignments((prev) =>
                    prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a))
                  );
                  setShowEditAssignmentDialog(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherClassView;
