import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ClientForm from './ClientForm';
import { createClient, resetCreateStatus } from './clientSlice';

const CreateClientPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error } = useSelector((state) => state.clients);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success('Client created successfully.');
      dispatch(resetCreateStatus());
      navigate('/clients');
    }
  }, [createStatus, dispatch, navigate]);

  const handleCreate = async (data) => {
    await dispatch(createClient(data)).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create Client</h2>
        <p className="mt-2 text-sm text-slate-500">Add a new client to your account.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ClientForm onSubmit={handleCreate} loading={createStatus === 'loading'} error={error} />
      </div>
    </div>
  );
};

export default CreateClientPage;
