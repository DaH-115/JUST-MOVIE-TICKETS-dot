export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="font-medium text-gray-500">Loading...</p>
      </div>
    </div>
  );
}