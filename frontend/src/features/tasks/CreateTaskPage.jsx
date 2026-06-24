import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TaskForm from './TaskForm';
import { createTask, resetCreateStatus } from './taskSlice';
import { fetchProjects } from '../projects/projectSlice';

const CreateTaskPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, error } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100, offset: 0, search: '', ordering: 'title' }));
  }, [dispatch]);

  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast.success('Task created successfully.');
      dispatch(resetCreateStatus());
      navigate('/tasks');
    }
  }, [createStatus, dispatch, navigate]);

  const handleCreate = async (data) => {
    await dispatch(createTask(data)).unwrap();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Create Task</h2>
        <p className="mt-2 text-sm text-slate-500">Add a new task and assign it to a project.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <TaskForm projects={projects} onSubmit={handleCreate} loading={createStatus === 'loading'} error={error} />
      </div>
    </div>
  );
};

export default CreateTaskPage;
