export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="flex items-center space-x-2">
        <div className="animate-bounce w-8 h-8 bg-red-500 rounded-full"></div>
        <div className="animate-bounce w-8 h-8 bg-green-500 rounded-full animation-delay-200"></div>
        <div className="animate-bounce w-8 h-8 bg-blue-500 rounded-full animation-delay-400"></div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Loading your shopping experience...
      </p>
    </div>
  );
}
