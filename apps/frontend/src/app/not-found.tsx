export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>404</h1>
        <p className='text-lg text-gray-600 mb-8'>Página no encontrada</p>
        <a
          href='/'
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
