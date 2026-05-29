import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GovernmentProgramSearch from './pages/GovernmentProgramSearch';
import SavedPrograms from './pages/SavedPrograms';
import AreaDetail from './pages/AreaDetail';
import AgentRunPage from './pages/AgentRun';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import DocumentDetail from './pages/DocumentDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/program-search"
            element={
              <ProtectedRoute>
                <MainLayout><GovernmentProgramSearch /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-programs"
            element={
              <ProtectedRoute>
                <MainLayout><SavedPrograms /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/areas/:areaId"
            element={
              <ProtectedRoute>
                <MainLayout><AreaDetail /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/:agentId/run"
            element={
              <ProtectedRoute>
                <MainLayout><AgentRunPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <MainLayout><ProjectList /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <MainLayout><ProjectDetail /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:documentId"
            element={
              <ProtectedRoute>
                <MainLayout><DocumentDetail /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
