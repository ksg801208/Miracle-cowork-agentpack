import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AreaDetail from './pages/AreaDetail';
import AgentRunPage from './pages/AgentRun';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={<MainLayout><Dashboard /></MainLayout>}
        />
        <Route
          path="/areas/:areaId"
          element={<MainLayout><AreaDetail /></MainLayout>}
        />
        <Route
          path="/agents/:agentId/run"
          element={<MainLayout><AgentRunPage /></MainLayout>}
        />
        <Route
          path="/projects"
          element={<MainLayout><ProjectList /></MainLayout>}
        />
        <Route
          path="/projects/:projectId"
          element={<MainLayout><ProjectDetail /></MainLayout>}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
