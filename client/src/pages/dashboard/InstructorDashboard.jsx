import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import DashboardSidebar from '../../components/DashboardSidebar';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import CourseCard from '../../components/dashboard/CourseCard';
import CourseListSkeleton from '../../components/dashboard/CourseListSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import FreeAccessWidget from '../../components/dashboard/widgets/FreeAccessWidget';
import DailyCheckInWidget from '../../components/dashboard/widgets/DailyCheckInWidget';

function InstructorDashboard({ user }) {
  const { courses, loading } = useCourses();

  const myCourses = courses.filter((c) => c.instructor?.id === user.id);

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-gray-50/50">
      <DashboardSidebar role={user?.role} />

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <WelcomeBanner
            badge="Dashboard Siswa • 100% Gratis"
            title={`Halo, ${user?.name} 👋`}
            description="Kelola course kamu dan pantau progress belajar siswa dengan mudah di sini."
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Course Saya</h2>
                <Link
                  to="/dashboard/courses/new"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  + Buat Course
                </Link>
              </div>

              {loading && <CourseListSkeleton />}

              {!loading && myCourses.length === 0 && (
                <EmptyState message='Kamu belum membuat course. Klik "Buat Course" untuk mulai.' />
              )}

              {!loading && myCourses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {myCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <FreeAccessWidget />
              <DailyCheckInWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;