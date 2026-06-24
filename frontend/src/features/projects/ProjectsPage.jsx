import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, setSearch, setClientFilter, setOffset, deleteProject } from './projectSlice';
import { fetchClients } from '../clients/clientSlice';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import SearchBox from '../../components/ui/SearchBox';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const {
    projects,
    total,
    limit,
    offset,
    search,
    selectedClient,
    fetchStatus,
    error
  } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    dispatch(fetchClients({ limit: 100, offset: 0, search: '', ordering: 'name' }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjects({ limit, offset, search, ordering: 'title', client: selectedClient }));
  }, [dispatch, limit, offset, search, selectedClient]);

  const columns = useMemo(
    () => [
      { header: 'Title', accessor: 'title' },
      { header: 'Client', accessor: (project) => project.client_details?.name || 'Unknown' },
      { header: 'Description', accessor: (project) => project.description || '-' },
      { header: 'Actions', accessor: 'actions' }
    ],
    []
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this project?')) {
        dispatch(deleteProject(id));
      }
    },
    [dispatch]
  );

  const rows = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        actions: (
          <div className="flex gap-2">
            <Link
              to={`/projects/edit/${project.id}`}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(project.id)}
              className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )
      })),
    [projects, handleDelete]
  );

  const handleSearch = () => {
    dispatch(setSearch(searchValue));
    dispatch(setOffset(0));
  };

  const handleClientChange = (event) => {
    dispatch(setClientFilter(event.target.value));
    dispatch(setOffset(0));
  };

  const handlePageChange = (newOffset) => {
    dispatch(setOffset(newOffset));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Projects</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your projects and associated clients.</p>
        </div>
        <Link
          to="/projects/create"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New Project
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <SearchBox value={searchValue} onChange={setSearchValue} onSearch={handleSearch} placeholder="Search projects" />
          <div>
            <label htmlFor="clientFilter" className="mb-2 block text-sm font-medium text-slate-700">
              Filter by Client
            </label>
            <select
              id="clientFilter"
              value={selectedClient}
              onChange={handleClientChange}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fetchStatus === 'loading' && <LoadingSpinner />}
        {fetchStatus === 'failed' && <div className="mt-6 text-sm text-red-600">{String(error)}</div>}
        {fetchStatus === 'succeeded' && projects.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No projects found. Create a project to get started.
          </div>
        )}

        {projects.length > 0 && <DataTable columns={columns} data={rows} />}

        {total > limit && (
          <Pagination limit={limit} offset={offset} total={total} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
