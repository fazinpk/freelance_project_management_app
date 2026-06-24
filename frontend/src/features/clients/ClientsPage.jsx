import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchClients, setSearch, setOffset, deleteClient } from './clientSlice';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import SearchBox from '../../components/ui/SearchBox';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientsPage = () => {
  const dispatch = useDispatch();
  const { clients, total, limit, offset, search, fetchStatus, error } = useSelector((state) => state.clients);
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    dispatch(fetchClients({ limit, offset, search, ordering: 'name' }));
  }, [dispatch, limit, offset, search]);

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Phone', accessor: 'phone' },
      {
        header: 'Actions',
        accessor: 'actions'
      }
    ],
    []
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this client?')) {
        dispatch(deleteClient(id));
      }
    },
    [dispatch]
  );

  const rows = useMemo(
    () =>
      clients.map((client) => ({
        ...client,
        actions: (
          <div className="flex gap-2">
            <Link
              to={`/clients/edit/${client.id}`}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(client.id)}
              className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )
      })),
    [clients, handleDelete]
  );

  const handleSearch = () => {
    dispatch(setSearch(searchValue));
    dispatch(setOffset(0));
  };

  const handlePageChange = (newOffset) => {
    dispatch(setOffset(newOffset));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Clients</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your clients and contact details.</p>
        </div>
        <Link
          to="/clients/create"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New Client
        </Link>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBox value={searchValue} onChange={setSearchValue} onSearch={handleSearch} placeholder="Search clients" />
        </div>

        {fetchStatus === 'loading' && <LoadingSpinner />}
        {fetchStatus === 'failed' && <div className="mt-6 text-sm text-red-600">{String(error)}</div>}
        {fetchStatus === 'succeeded' && clients.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No clients found. Start by creating your first client.
          </div>
        )}

        {clients.length > 0 && <DataTable columns={columns} data={rows} />}

        {total > limit && (
          <Pagination
            limit={limit}
            offset={offset}
            total={total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
