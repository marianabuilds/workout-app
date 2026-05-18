import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Schedule from './views/Schedule';
import WorkoutDetail from './views/WorkoutDetail';
import ActiveWorkout from './views/ActiveWorkout';
import Insights from './views/Insights';
import Profile from './views/Profile';
import History from './views/History';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';

const HIDE_NAV = ['/active'];

function Layout() {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV.includes(pathname);

  return (
    <div className="flex min-h-screen" style={{ background: '#020d0a' }}>
      <Sidebar />
      <div className="flex-1 min-h-screen md:ml-64 overflow-x-hidden">
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/schedule"       element={<Schedule />} />
          <Route path="/workout/:id"    element={<WorkoutDetail />} />
          <Route path="/active"         element={<ActiveWorkout />} />
          <Route path="/insights"       element={<Insights />} />
          <Route path="/history"        element={<History />} />
          <Route path="/profile"        element={<Profile />} />
        </Routes>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
