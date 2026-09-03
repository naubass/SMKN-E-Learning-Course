import { Outlet, Link } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-gray-900">
            SMK Learning
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/courses" className="text-sm text-gray-700 hover:text-[#F0653A]">
              Courses
            </Link>
            <Link to="/login" className="text-sm text-gray-700 hover:text-[#F0653A]">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#F0653A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d8552c]"
            >
              Daftar
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SMK Learning Platform
      </footer>
    </div>
  );
}

export default MainLayout;