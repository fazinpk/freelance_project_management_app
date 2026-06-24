import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../../components/ui/FormInput';

const ProjectForm = ({ clients, defaultValues = {}, onSubmit, loading, error }) => {
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
        placeholder="Project title"
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
          placeholder="Project description"
          className="h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="client" className="mb-2 block text-sm font-medium text-slate-700">
          Client
        </label>
        <select
          id="client"
          {...register('client', { required: 'Client is required' })}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.client && <p className="mt-2 text-sm text-red-600">{errors.client.message}</p>}
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
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
