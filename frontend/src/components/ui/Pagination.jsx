const Pagination = ({ limit, offset, total, onPageChange }) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (offset === 0) return;
    onPageChange(Math.max(0, offset - limit));
  };

  const handleNext = () => {
    if (offset + limit >= total) return;
    onPageChange(offset + limit);
  };

  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {Math.min(offset + 1, total)} to {Math.min(offset + limit, total)} of {total} clients
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={offset === 0}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 hover:cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={handleNext}
          disabled={offset + limit >= total}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50 hover:cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
