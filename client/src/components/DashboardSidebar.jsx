import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  BarChart3,
  PlusCircle,
  Users,
  Compass,
  Award,
} from 'lucide-react';

const linkBase =
  'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition';
const linkActive = 'bg-blue-50 text-blue-600 font-semibold';
const linkInactive = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

function DashboardSidebar({ role }) {
  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-8 lg:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
      <nav className="space-y-6">
        
        {/* Menu Utama / Beranda */}
        <div>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <Home className="w-5 h-5" />
              Beranda
            </NavLink>

            {isStudent && (
              <NavLink
                to="/dashboard/progress"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <BarChart3 className="w-5 h-5" />
                Progres Belajar
              </NavLink>
            )}
          </div>
        </div>

        {/* Bagian Learning / Kursus */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {isInstructor || isAdmin ? 'Kelola Pengajaran' : 'Eksplorasi'}
          </p>
          <div className="space-y-1">
            {(isInstructor || isAdmin) ? (
              <>
                <NavLink
                  to="/dashboard/courses"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  <BookOpen className="w-5 h-5" />
                  Course Saya
                </NavLink>

                <NavLink
                  to="/dashboard/courses/new"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  <PlusCircle className="w-5 h-5" />
                  Buat Course
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  <Compass className="w-5 h-5" />
                  Katalog Kelas
                </NavLink>
                <NavLink
                  to="/dashboard/certificates"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                >
                  <Award className="w-5 h-5" />
                  Sertifikat Saya
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Bagian Khusus Admin */}
        {isAdmin && (
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Administrasi
            </p>
            <div className="space-y-1">
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                <Users className="w-5 h-5" />
                Kelola User
              </NavLink>
            </div>
          </div>
        )}

      </nav>
    </aside>
  );
}

export default DashboardSidebar;