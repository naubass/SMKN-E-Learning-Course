import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-600">Halaman tidak ditemukan.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;