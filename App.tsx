import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DPIAManager from './pages/DPIAManager';
import AIGovernance from './pages/AIGovernance';
import AISecurity from './pages/AISecurity';
import IncidentCentre from './pages/IncidentCentre';
import PolicyAdvisor from './pages/PolicyAdvisor';
import ControlLibrary from './pages/ControlLibrary';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dpia" element={<DPIAManager />} />
        <Route path="/ai-governance" element={<AIGovernance />} />
        <Route path="/ai-security" element={<AISecurity />} />
        <Route path="/incidents" element={<IncidentCentre />} />
        <Route path="/policy-advisor" element={<PolicyAdvisor />} />
        <Route path="/control-library" element={<ControlLibrary />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
