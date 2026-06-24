import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="hidden md:block">
      <div className="space-y-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
              isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
              isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`
          }
        >
          Clients
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
              isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`
          }
        >
          Projects
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
              isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`
          }
        >
          Tasks
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
