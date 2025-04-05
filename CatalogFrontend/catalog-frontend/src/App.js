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
import StudentOverview from './pages/StudentOverview';
import TeacherHistory from './pages/TeacherHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher-history" element={<TeacherHistory />} />
        <Route path="/subject" element={<TeacherClassView />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/assignment" element={<StudentAssignmentView />} />
        <Route path="/student/overview" element={<StudentOverview />} />
      </Routes>
    </Router>
  );
}

export default App;