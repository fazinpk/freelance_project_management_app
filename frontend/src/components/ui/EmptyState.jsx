const EmptyState = ({ title = 'Nothing here', description = '', action }) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
