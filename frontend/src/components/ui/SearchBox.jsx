const SearchBox = ({ value, onChange, onSearch, placeholder }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <button
        type="button"
        onClick={onSearch}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 hover:cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;
