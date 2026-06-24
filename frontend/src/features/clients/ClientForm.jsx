import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FormInput from '../../components/ui/FormInput';

const ClientForm = ({ defaultValues = {}, onSubmit, loading, error }) => {
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
        label="Name"
        name="name"
        type="text"
        placeholder="Client name"
        register={register}
        required={{ required: 'Name is required', minLength: { value: 3, message: 'Name must have at least 3 characters' } }}
        errors={errors}
      />
      <FormInput
        label="Email"
        name="email"
        type="email"
        placeholder="client@example.com"
        register={register}
        required={{ required: 'Email is required' }}
        errors={errors}
      />
      <FormInput
        label="Phone"
        name="phone"
        type="text"
        placeholder="1234567890"
        register={register}
        required={{
          required: 'Phone is required',
          pattern: {
            value: /^\d{10,15}$/, 
            message: 'Phone number must contain 10 to 15 digits.'
          }
        }}
        errors={errors}
      />
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
          {loading ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
