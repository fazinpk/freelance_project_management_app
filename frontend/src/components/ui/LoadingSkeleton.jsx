const LoadingSkeleton = ({ rows = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 w-full animate-pulse rounded bg-slate-100" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
