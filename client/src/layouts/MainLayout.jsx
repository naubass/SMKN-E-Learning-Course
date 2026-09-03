import { Outlet, Link } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl text-blue-600">
            SMK Learning
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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