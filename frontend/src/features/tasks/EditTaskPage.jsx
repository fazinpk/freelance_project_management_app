import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import TaskForm from './TaskForm';
import { fetchProjects } from '../projects/projectSlice';
import taskService from '../../services/taskService';
import { updateTask, resetUpdateStatus } from './taskSlice';

const EditTaskPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateStatus, error } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [task, setTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100, offset: 0, search: '', ordering: 'title' }));
  }, [dispatch]);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoadingTask(true);
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        setFetchError(err.response?.data || err.message);
      } finally {
        setLoadingTask(false);
      }
    };

    loadTask();
  }, [id]);

  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('Task updated successfully.');
      dispatch(resetUpdateStatus());
      navigate('/tasks');
    }
  }, [updateStatus, dispatch, navigate]);

  const handleUpdate = async (data) => {
    await dispatch(updateTask({ id, taskData: data })).unwrap();
  };

  if (loadingTask) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm"><p>Loading task...</p></div>;
  }

  if (fetchError) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-red-600">{String(fetchError)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Edit Task</h2>
        <p className="mt-2 text-sm text-slate-500">Update task details and project assignment.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <TaskForm
          projects={projects}
          defaultValues={{
            title: task.title,
            description: task.description,
            project: task.project,
            status: task.status,
            priority: task.priority
          }}
          onSubmit={handleUpdate}
          loading={updateStatus === 'loading'}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditTaskPage;
