const StatCard = ({ title, value, change, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div>{children}</div>
      </div>
      {typeof change !== 'undefined' && (
        <p className="mt-2 text-sm text-slate-500">{change}</p>
      )}
    </div>
  );
};

export default StatCard;
