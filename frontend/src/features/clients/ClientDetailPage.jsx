const ClientDetailPage = ({ client }) => {
  if (!client) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Client Details</h2>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Name</dt>
            <dd className="mt-2 text-base text-slate-900">{client.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="mt-2 text-base text-slate-900">{client.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Phone</dt>
            <dd className="mt-2 text-base text-slate-900">{client.phone}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ClientDetailPage;
