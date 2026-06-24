import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import { createProject, resetCreateStatus } from './projectSlice';
import { fetchClients } from '../clients/clientSlice';

const CreateProjectPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchClients({ limit: 100, offset: 0, search: '', ordering: 'name' }));
  }, [dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success('Project created successfully.');
      dispatch(resetCreateStatus());
      navigate('/projects');
    }
  }, [createStatus, dispatch, navigate]);

  const handleCreate = async (data) => {
    await dispatch(createProject(data)).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create Project</h2>
        <p className="mt-2 text-sm text-slate-500">Add a new project and assign it to a client.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ProjectForm clients={clients} onSubmit={handleCreate} loading={createStatus === 'loading'} error={error} />
      </div>
    </div>
  );
};

export default CreateProjectPage;
