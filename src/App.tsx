import { useEffect, useState, useCallback } from 'react';
import { ForestEnvironment } from './components/ForestEnvironment';
import { LandingPage } from './components/LandingPage';
import { ApplicationForm } from './components/ApplicationForm';
import { AdminAccess } from './components/admin/AdminAccess';
import { AdminDashboard } from './components/admin/AdminDashboard';

type Route = 'home' | 'apply' | 'admin-access' | 'admin-dashboard';

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '/apply') return 'apply';
  if (hash === '/admin') {
    return localStorage.getItem('isExecutive') === 'true' ? 'admin-dashboard' : 'admin-access';
  }
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((hash: string) => {
    window.location.hash = hash;
  }, []);

  const isAdmin = route === 'admin-access' || route === 'admin-dashboard';

  return (
    <div className="relative min-h-screen">
      <ForestEnvironment variant={isAdmin ? 'admin' : 'applicant'} />

      {route === 'home' && <LandingPage onApply={() => navigate('/apply')} onAdminAccess={() => navigate('/admin')} />}
      {route === 'apply' && <ApplicationForm onBack={() => navigate('')} />}
      {route === 'admin-access' && (
        <AdminAccess onAccess={() => { setRoute('admin-dashboard'); }} />
      )}
      {route === 'admin-dashboard' && (
        <AdminDashboard onLogout={() => { navigate(''); }} />
      )}
    </div>
  );
}
