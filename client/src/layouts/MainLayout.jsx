import { Link, Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar Resmi */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo & Nama Sekolah */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo-sekolah.png" 
              alt="Logo SMKN 1 Kabupaten Tangerang" 
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                SMKN 1 Kabupaten Tangerang
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sekolah Berbasis Taruna
              </span>
            </div>
          </Link>

          {/* Menu Navigasi & Tombol Aksi */}
          <nav className="flex items-center gap-6">
            <Link 
              to="/courses" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Courses
            </Link>
            <Link 
              to="/login" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition"
            >
              Daftar
            </Link>
          </nav>

        </div>
      </header>

      {/* Konten Halaman */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;