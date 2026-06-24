const FormInput = ({ label, name, register, required, type = 'text', errors, placeholder }) => {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, required)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      {errors[name] && <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );
};

export default FormInput;
