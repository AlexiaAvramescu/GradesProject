import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import TeacherClassView from './pages/TeacherClassView';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssignmentView from './pages/StudentAssignmentView';
import Register from './pages/Register';
import FirstPage from './pages/FirstPage';
import Account from './pages/Account';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/subject" element={<TeacherClassView />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/assignment" element={<StudentAssignmentView />} />
      </Routes>
    </Router>
  );
}

export default App;