import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import TeacherClassView from './pages/TeacherClassView';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssignmentView from './pages/StudentAssignmentView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/subject" element={<TeacherClassView />} />
        <Route path="/student" element = {<StudentDashboard/>} />
        <Route path="/student/assignment" element={<StudentAssignmentView />} />
      </Routes>
    </Router>
  );
}

export default App;
