import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Project Manager</h1>
            {user && <p className="text-sm text-slate-500">Signed in as {user.username}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 hover:cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-6 flex flex-wrap gap-3 md:hidden">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
              }`
            }
          >
            Clients
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
              }`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
              }`
            }
          >
            Tasks
          </NavLink>
        </nav>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <Sidebar />
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
