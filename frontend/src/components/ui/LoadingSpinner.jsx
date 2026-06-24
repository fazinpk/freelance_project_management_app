const LoadingSpinner = () => {
  return (
    <div className="mt-8 flex items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
    </div>
  );
};

export default LoadingSpinner;
