// ErrorState.tsx
import { X } from 'lucide-react';

export default function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <X className='w-8 h-8 text-red-600' />
        </div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Error al cargar los datos
        </h2>
        <p className='text-gray-600 mb-4'>{error}</p>
        <button
          onClick={onRetry}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
