import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clientService from '../../services/clientService';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useDispatch } from 'react-redux';
import { fetchProjects } from '../projects/projectSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientsCount, setClientsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, in_progress: 0, completed: 0 });
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const clientsData = await clientService.getClients({ limit: 1, offset: 0 });
        setClientsCount(clientsData.count || 0);

        const projectsData = await projectService.getProjects({ limit: 100, offset: 0 });
        setProjectsCount(projectsData.count || 0);
        setProjectsList(projectsData.results || []);

        const tasksData = await taskService.getTasks({ limit: 5, offset: 0 });
        setTasksCount(tasksData.count || 0);
        setRecentTasks(tasksData.results || []);

        // status counts
        const pending = await taskService.getTasks({ limit: 1, offset: 0, status: 'Pending' });
        const inProgress = await taskService.getTasks({ limit: 1, offset: 0, status: 'In Progress' });
        const completed = await taskService.getTasks({ limit: 1, offset: 0, status: 'Completed' });
        setStatusCounts({ pending: pending.count || 0, in_progress: inProgress.count || 0, completed: completed.count || 0 });

        // ensure projects in store for mapping in other pages
        dispatch(fetchProjects({ limit: 100, offset: 0, search: '', ordering: 'title' }));
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [dispatch]);

  const projectsMap = useMemo(() => {
    const map = {};
    projectsList.forEach((p) => (map[p.id] = p));
    return map;
  }, [projectsList]);

  const columns = useMemo(
    () => [
      { header: 'Title', accessor: 'title' },
      { header: 'Project', accessor: (task) => projectsMap[task.project]?.title || 'Unknown' },
      { header: 'Status', accessor: 'status' },
      { header: 'Priority', accessor: (task) => (task.priority === '1' ? 'High' : task.priority === '2' ? 'Medium' : 'Low') }
    ],
    [projectsMap]
  );

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-red-600">{String(error)}</p></div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Clients" value={clientsCount} />
        <StatCard title="Total Projects" value={projectsCount} />
        <StatCard title="Total Tasks" value={tasksCount} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Recent Tasks</h2>
            <div className="flex gap-2">
              <Link to="/tasks/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">New Task</Link>
              <Link to="/projects/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">New Project</Link>
              <Link to="/clients/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">New Client</Link>
            </div>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState title="No recent tasks" description="Create tasks to see them here." />
          ) : (
            <div className="rounded-3xl bg-white p-6 shadow-sm mt-4">
              <DataTable columns={columns} data={recentTasks} />
            </div>
          )}
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Task Status</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-sm font-semibold text-slate-900">{statusCounts.pending}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-sm font-semibold text-slate-900">{statusCounts.in_progress}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-sm font-semibold text-slate-900">{statusCounts.completed}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/clients/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Create Client</Link>
              <Link to="/projects/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Create Project</Link>
              <Link to="/tasks/create" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Create Task</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
