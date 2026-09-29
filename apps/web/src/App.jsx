import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ApplicantDashboard from './pages/ApplicantDashboard.jsx';
import UniversityDashboard from './pages/UniversityDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">EC</div>
          <div>
            <div className="brand-name">Edu_Connect</div>
            <div className="brand-subtitle">Tanzania Student University Application Platform</div>
          </div>
        </div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/applicant">Applicant</Link>
          <Link to="/university">University</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/applicant" element={<ApplicantDashboard />} />
        <Route path="/university" element={<UniversityDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
