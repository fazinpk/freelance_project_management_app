import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks, setSearch, setStatusFilter, setPriorityFilter, setOrdering, setOffset, deleteTask } from './taskSlice';
import { fetchProjects } from '../projects/projectSlice';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import SearchBox from '../../components/ui/SearchBox';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TasksPage = () => {
  const dispatch = useDispatch();
  const {
    tasks,
    total,
    limit,
    offset,
    search,
    status,
    priority,
    ordering,
    fetchStatus,
    error
  } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [searchValue, setSearchValue] = useState(search);

  const projectsMap = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [projects]);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100, offset: 0, search: '', ordering: 'title' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTasks({ limit, offset, search, status, priority, ordering }));
  }, [dispatch, limit, offset, search, status, priority, ordering]);

  const columns = useMemo(
    () => [
      { header: 'Title', accessor: 'title' },
      { header: 'Project', accessor: (task) => projectsMap[task.project]?.title || 'Unknown' },
      { header: 'Status', accessor: 'status' },
      { header: 'Priority', accessor: (task) => (task.priority === '1' ? 'High' : task.priority === '2' ? 'Medium' : 'Low') },
      { header: 'Actions', accessor: 'actions' }
    ],
    [projectsMap]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this task?')) {
        dispatch(deleteTask(id));
      }
    },
    [dispatch]
  );

  const rows = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        actions: (
          <div className="flex gap-2">
            <Link
              to={`/tasks/${task.id}`}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View
            </Link>
            <Link
              to={`/tasks/edit/${task.id}`}
              className="rounded-2xl bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )
      })),
    [tasks, handleDelete]
  );

  const handleSearch = () => {
    dispatch(setSearch(searchValue));
    dispatch(setOffset(0));
  };

  const handleStatusChange = (event) => {
    dispatch(setStatusFilter(event.target.value));
    dispatch(setOffset(0));
  };

  const handlePriorityChange = (event) => {
    dispatch(setPriorityFilter(event.target.value));
    dispatch(setOffset(0));
  };

  const handleOrderingChange = (event) => {
    dispatch(setOrdering(event.target.value));
    dispatch(setOffset(0));
  };

  const handlePageChange = (newOffset) => {
    dispatch(setOffset(newOffset));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your tasks and track progress by project.</p>
        </div>
        <Link
          to="/tasks/create"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New Task
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SearchBox value={searchValue} onChange={setSearchValue} onSearch={handleSearch} placeholder="Search tasks" />
          <div>
            <label htmlFor="statusFilter" className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="statusFilter"
              value={status}
              onChange={handleStatusChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="priorityFilter" className="mb-2 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priority}
              onChange={handlePriorityChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All priorities</option>
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="ordering" className="mb-2 block text-sm font-medium text-slate-700">
              Order by
            </label>
            <select
              id="ordering"
              value={ordering}
              onChange={handleOrderingChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {fetchStatus === 'loading' && <LoadingSpinner />}
        {fetchStatus === 'failed' && <div className="mt-6 text-sm text-red-600">{String(error)}</div>}
        {fetchStatus === 'succeeded' && tasks.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No tasks found. Create a task to get started.
          </div>
        )}

        {tasks.length > 0 && <DataTable columns={columns} data={rows} />}

        {total > limit && (
          <Pagination limit={limit} offset={offset} total={total} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default TasksPage;
