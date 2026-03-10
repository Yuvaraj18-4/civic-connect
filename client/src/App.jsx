import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import IssueList from './pages/IssueList';
import IssueDetails from './pages/IssueDetails';
import ForumHome from './pages/ForumHome';
import TopicDetails from './pages/TopicDetails';
import EventsList from './pages/EventsList';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user && user.role === 'Admin' ? children : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={!isAuthPage ? "app-layout" : ""}>
      {!isAuthPage && <Sidebar />}
      <div className={!isAuthPage ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/report-issue" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
          <Route path="/issues" element={<IssueList />} />
          <Route path="/issues/:id" element={<IssueDetails />} />

          <Route path="/forum" element={<ForumHome />} />
          <Route path="/forum/:id" element={<TopicDetails />} />

          <Route path="/events" element={<EventsList />} />

          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
