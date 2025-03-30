
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import TeacherClassView from './pages/TeacherClassView';
import TeacherDashboard from './pages/TeacherDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/class/:classId" element={<TeacherClassView />} />
      </Routes>
    </Router>
  );
}

export default App;
