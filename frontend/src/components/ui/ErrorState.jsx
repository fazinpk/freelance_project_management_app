const ErrorState = ({ message = 'Something went wrong' }) => {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {String(message)}
    </div>
  );
};

export default ErrorState;
