import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LogOut } from 'lucide-react';

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar Resmi */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

          {/* Logo & Nama Sekolah */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img
              src="/logo-sekolah.png"
              alt="Logo SMKN 1 Kabupaten Tangerang"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-90">
                SMKN 1 Kabupaten Tangerang
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sekolah Berbasis Taruna
              </span>
            </div>
          </Link>

          {/* Menu Navigasi & Tombol Aksi */}
          <nav className="flex items-center gap-4">
            <Link
              to="/courses"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition px-2 py-1"
            >
              Courses
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                {/* Sapaan Nama menuju Dashboard dengan gaya badge rapi */}
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-gray-200/80 hover:bg-slate-100 transition"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Halo, {user.name}
                  </span>
                </Link>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
                  title="Keluar akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
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