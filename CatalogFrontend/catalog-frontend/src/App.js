
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import TeacherClassView from './pages/TeacherClassView';
import TeacherDashboard from './pages/TeacherDashboard';
import Register from './pages/Register';
import FirstPage from './pages/FirstPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/subject" element={<TeacherClassView />} />
      </Routes>
    </Router>
  );
}

export default App;
