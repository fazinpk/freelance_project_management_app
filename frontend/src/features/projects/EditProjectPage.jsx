import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProjectForm from './ProjectForm';
import { fetchClients } from '../clients/clientSlice';
import projectService from '../../services/projectService';
import { updateProject, resetUpdateStatus } from './projectSlice';

const EditProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateStatus, error } = useSelector((state) => state.projects);
  const { clients } = useSelector((state) => state.clients);
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    dispatch(fetchClients({ limit: 100, offset: 0, search: '', ordering: 'name' }));
  }, [dispatch]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoadingProject(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err) {
        setFetchError(err.response?.data || err.message);
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [id]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Project updated successfully.');
      dispatch(resetUpdateStatus());
      navigate('/projects');
    }
  }, [updateStatus, dispatch, navigate]);

  const handleUpdate = async (data) => {
    await dispatch(updateProject({ id, projectData: data })).unwrap();
  };

  if (loadingProject) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm"><p>Loading project...</p></div>;
  }

  if (fetchError) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-red-600">{String(fetchError)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Edit Project</h2>
        <p className="mt-2 text-sm text-slate-500">Update project details and client assignment.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ProjectForm
          clients={clients}
          defaultValues={{
            title: project.title,
            description: project.description,
            client: project.client
          }}
          onSubmit={handleUpdate}
          loading={updateStatus === 'loading'}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditProjectPage;
