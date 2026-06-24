import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/layout/RequireAuth';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import ClientsPage from './features/clients/ClientsPage';
import CreateClientPage from './features/clients/CreateClientPage';
import EditClientPage from './features/clients/EditClientPage';
import ProjectsPage from './features/projects/ProjectsPage';
import CreateProjectPage from './features/projects/CreateProjectPage';
import EditProjectPage from './features/projects/EditProjectPage';
import TasksPage from './features/tasks/TasksPage';
import CreateTaskPage from './features/tasks/CreateTaskPage';
import EditTaskPage from './features/tasks/EditTaskPage';
import TaskDetailsPage from './features/tasks/TaskDetailsPage';
import { fetchCurrentUser } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { accessToken, user, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken && !user && status !== 'loading') {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, user, status, dispatch]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/create" element={<CreateClientPage />} />
            <Route path="/clients/edit/:id" element={<EditClientPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/create" element={<CreateProjectPage />} />
            <Route path="/projects/edit/:id" element={<EditProjectPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/create" element={<CreateTaskPage />} />
            <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
            <Route path="/tasks/:id" element={<TaskDetailsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
