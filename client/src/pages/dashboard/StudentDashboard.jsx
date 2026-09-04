import { useCourses } from '../../hooks/useCourses';
import DashboardSidebar from '../../components/DashboardSidebar';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import CourseCard from '../../components/dashboard/CourseCard';
import CourseListSkeleton from '../../components/dashboard/CourseListSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import FreeAccessWidget from '../../components/dashboard/widgets/FreeAccessWidget';
import DailyCheckInWidget from '../../components/dashboard/widgets/DailyCheckInWidget';

function StudentDashboard({ user }) {
  const { courses, loading } = useCourses();

  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-gray-50/50">
      <DashboardSidebar role={user?.role} />

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <WelcomeBanner
            badge="Dashboard Siswa • 100% Gratis"
            title={`Halo, ${user?.name} 👋`}
            description="Akses seluruh materi kejuruan SMK secara gratis, tingkatkan skill, dan raih masa depan gemilang."
          />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-lg font-bold text-gray-900">Rekomendasi Course Gratis</h2>

              {loading && <CourseListSkeleton />}

              {!loading && courses.length === 0 && (
                <EmptyState message="Belum ada course yang tersedia." />
              )}

              {!loading && courses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {courses.map((course) => (
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

export default StudentDashboard;