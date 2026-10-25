import { useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import LearnerDashboard from './pages/LearnerDashboard.jsx';
import { UserProvider, useUser } from './context/UserContext.jsx';
import CampusPulse from './components/CampusPulse.jsx';

function CampusFlowPages() {
  const { setRole } = useUser();
  useEffect(() => {
    // The original interactions expect all four page sections to exist together.
    // Their existing IDs and handlers are preserved; React mounts each page component.
    const script = document.createElement('script');
    script.src = '/campus-flow-legacy.js';
    script.async = false;
    script.onload = () => {
      const syncRole = () => {
        const hash = window.location.hash;
        setRole(hash === '#student' ? 'learner' : hash === '#teacher' ? 'faculty' : null);
      };
      syncRole();
      window.addEventListener('hashchange', syncRole);
      window.addEventListener('campusflow:cleanup', () => window.removeEventListener('hashchange', syncRole), { once: true });
    };
    document.body.appendChild(script);
    return () => {
      window.dispatchEvent(new Event('campusflow:cleanup'));
      script.remove();
    };
  }, [setRole]);
  return <main className="campus-flow-app">
    <HomePage />
    <LoginPage />
    <FacultyDashboard />
    <LearnerDashboard />
    <CampusPulse />
  </main>;
}

export default function App() {
  return <UserProvider><CampusFlowPages /></UserProvider>;
}
