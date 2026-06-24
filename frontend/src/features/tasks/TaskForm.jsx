import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../../components/ui/FormInput';

const TaskForm = ({ projects, defaultValues = {}, onSubmit, loading, error }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (error) {
      toast.error(String(error));
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Title"
        name="title"
        type="text"
        placeholder="Task title"
        register={register}
        required={{ required: 'Title is required', minLength: { value: 3, message: 'Title must have at least 3 characters' } }}
        errors={errors}
      />

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must have at least 10 characters' }
          })}
          placeholder="Task description"
          className="h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="project" className="mb-2 block text-sm font-medium text-slate-700">
          Project
        </label>
        <select
          id="project"
          {...register('project', { required: 'Project is required' })}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        {errors.project && <p className="mt-2 text-sm text-red-600">{errors.project.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="mb-2 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority', { required: 'Priority is required' })}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">Select priority</option>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
          {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
