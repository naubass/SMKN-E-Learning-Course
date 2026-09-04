function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export default EmptyState;