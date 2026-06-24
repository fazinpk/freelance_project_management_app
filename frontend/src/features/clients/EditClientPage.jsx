import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ClientForm from './ClientForm';
import { updateClient, resetUpdateStatus } from './clientSlice';
import clientService from '../../services/clientService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditClientPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateStatus, error } = useSelector((state) => state.clients);
  const [client, setClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await clientService.getClientById(id);
        setClient(data);
      } catch (fetchErr) {
        setFetchError(fetchErr.response?.data || fetchErr.message);
      } finally {
        setLoadingClient(false);
      }
    };

    loadClient();
  }, [id]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Client updated successfully.');
      dispatch(resetUpdateStatus());
      navigate('/clients');
    }
  }, [updateStatus, dispatch, navigate]);

  const handleUpdate = async (data) => {
    await dispatch(updateClient({ id, clientData: data })).unwrap();
  };

  if (loadingClient) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return <div className="rounded-3xl bg-white p-6 text-red-600 shadow-sm">{String(fetchError)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Edit Client</h2>
        <p className="mt-2 text-sm text-slate-500">Update the selected client information.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ClientForm defaultValues={client} onSubmit={handleUpdate} loading={updateStatus === 'loading'} error={error} />
      </div>
    </div>
  );
};

export default EditClientPage;
