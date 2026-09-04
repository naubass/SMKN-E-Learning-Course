import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import api from '../utils/api';
import DashboardSidebar from '../components/DashboardSidebar';

const BACKEND_URL = 'http://localhost:5000';

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${BACKEND_URL}${thumbnail}`;
};

function CourseCard({ course }) {
  const thumbnailUrl = resolveThumbnail(course.thumbnail);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {course.category}
          </span>
        </div>

        <div className="mt-4 flex gap-4">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="h-20 w-28 rounded-xl object-cover shrink-0 bg-gray-100"
            />
          ) : (
            <div className="flex h-20 w-28 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-gray-100 text-xl font-bold text-gray-400 shrink-0">
              {course.title?.charAt(0) || '?'}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2">
              {course.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="w-full mr-4">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
            <span>Progress Belajar</span>
            <span>0%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 w-0 rounded-full bg-blue-600" />
          </div>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          Mulai Belajar
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isStaff = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Gagal memuat courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const visibleCourses = isStaff
    ? user.role === 'ADMIN'
      ? courses
      : courses.filter((c) => c.instructor?.id === user.id)
    : courses;

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-gray-50/50">
      <DashboardSidebar role={user?.role} />

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          
          {/* Welcome Banner dengan Background Foto & Overlay Transparan */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-md sm:px-10">
            {/* Background Foto (menggunakan gambar hero yang sama, pastikan ada di folder public) */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url('/hero.webp')` }}
            />
            {/* Gradient Overlay Transparan Gelap */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />

            <div className="relative z-10 max-w-2xl">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
                Dashboard Siswa • 100% Gratis
              </span>
              <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
                Halo, {user?.name} 👋
              </h1>
              <p className="mt-2 text-sm text-blue-100 leading-relaxed">
                {isStaff
                  ? 'Kelola course kamu dan pantau progress belajar siswa dengan mudah di sini.'
                  : 'Akses seluruh materi kejuruan SMK secara gratis, tingkatkan skill, dan raih masa depan gemilang.'}
              </p>
            </div>
          </div>

          {/* Layout Grid Utama & Sidebar Kanan (Info & Check-in) */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Kolom Kiri/Utama: List Course */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {isStaff ? 'Course Saya' : 'Rekomendasi Course Gratis'}
                </h2>
                {isStaff && (
                  <Link
                    to="/dashboard/courses/new"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    + Buat Course
                  </Link>
                )}
              </div>

              {loading && (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
                      <div className="flex gap-4">
                        <div className="h-20 w-28 rounded-xl bg-gray-200" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 w-3/4 rounded bg-gray-200" />
                          <div className="h-3 w-1/2 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && visibleCourses.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                  <p className="text-sm text-gray-500">
                    {isStaff
                      ? 'Kamu belum membuat course. Klik "Buat Course" untuk mulai.'
                      : 'Belum ada course yang tersedia.'}
                  </p>
                </div>
              )}

              {!loading && visibleCourses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>

            {/* Kolom Kanan: Widget Tambahan (Info Platform & Check-in) */}
            <div className="space-y-6">
              
              {/* Widget Akses Gratis */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Akses Tanpa Batas</h3>
                    <p className="text-xs text-gray-500">Semua modul & materi terbuka</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Platform pembelajaran resmi SMKN 1 Kabupaten Tangerang dapat diakses sepenuhnya secara gratis oleh seluruh siswa/i.
                  </p>
                </div>
              </div>

              {/* Widget Daily Check-in */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Daily Check-in</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Aktif</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Bangun kebiasaan belajar harian yang konsisten dan terarah.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Check-in hari ini berhasil dicatat!')}
                  className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  Tulis Check-in Hari Ini
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;