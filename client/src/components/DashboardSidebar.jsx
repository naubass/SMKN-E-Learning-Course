import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BarChart3,
  PlusCircle,
  Users,
  Compass,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const linkBase =
  'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition';
const linkActive = 'bg-blue-50 text-blue-600 font-semibold';
const linkInactive = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

function DashboardSidebar({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';

  const linkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? linkActive : linkInactive} ${
      collapsed ? 'lg:justify-center lg:px-0' : ''
    }`;

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className={`mb-4 flex items-center ${collapsed ? 'lg:justify-center' : 'justify-between px-1'}`}>
        {!collapsed && (
          <span className="hidden text-xs font-bold uppercase tracking-wider text-slate-400 lg:block">
            Menu Utama
          </span>
        )}
        
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition lg:flex"
          title={collapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={closeMobile}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition lg:hidden ml-auto"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="space-y-6 flex-1">
        <div>
          <div className="space-y-1">
            <NavLink to="/dashboard" end className={linkClass} title="Beranda" onClick={closeMobile}>
              <Home className="w-5 h-5 shrink-0" />
              <span className={collapsed ? 'lg:hidden' : ''}>Beranda</span>
            </NavLink>

            {isStudent && (
              <NavLink to="/dashboard/progress" className={linkClass} title="Progres Belajar" onClick={closeMobile}>
                <BarChart3 className="w-5 h-5 shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>Progres Belajar</span>
              </NavLink>
            )}
          </div>
        </div>

        <div>
          <p className={`px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 ${collapsed ? 'lg:hidden' : ''}`}>
            {isInstructor || isAdmin ? 'Kelola Pengajaran' : 'Eksplorasi'}
          </p>
          <div className="space-y-1">
            {(isInstructor || isAdmin) ? (
              <>
                <NavLink to="/dashboard/courses" className={linkClass} title="Course Saya" onClick={closeMobile}>
                  <BookOpen className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>Course Saya</span>
                </NavLink>

                <NavLink to="/dashboard/courses/new" className={linkClass} title="Buat Course" onClick={closeMobile}>
                  <PlusCircle className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>Buat Course</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/courses" className={linkClass} title="Katalog Kelas" onClick={closeMobile}>
                  <Compass className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>Katalog Kelas</span>
                </NavLink>
                <NavLink to="/dashboard/certificates" className={linkClass} title="Sertifikat Saya" onClick={closeMobile}>
                  <Award className="w-5 h-5 shrink-0" />
                  <span className={collapsed ? 'lg:hidden' : ''}>Sertifikat Saya</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {isAdmin && (
          <div>
            <p className={`px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 ${collapsed ? 'lg:hidden' : ''}`}>
              Administrasi
            </p>
            <div className="space-y-1">
              <NavLink to="/dashboard/users" className={linkClass} title="Kelola User" onClick={closeMobile}>
                <Users className="w-5 h-5 shrink-0" />
                <span className={collapsed ? 'lg:hidden' : ''}>Kelola User</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Tombol Floating Menu Mobile (Dipindah ke Kiri Bawah & Warna Mencolok agar pasti terlihat) */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 left-6 z-[99999] flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-2xl hover:bg-red-700 transition lg:hidden"
        title="Buka Menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[99999] w-72 max-w-[80vw] bg-white px-4 py-6 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-gray-200 bg-white py-6 lg:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto transition-all duration-300 ${
          collapsed ? 'w-20 px-2' : 'w-64 px-4'
        }`}
      >
        {SidebarContent}
      </aside>
    </>
  );
}

export default DashboardSidebar;