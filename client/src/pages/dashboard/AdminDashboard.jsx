import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { useUsers } from '../../hooks/useUsers';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import CourseCard from '../../components/dashboard/CourseCard';
import CourseListSkeleton from '../../components/dashboard/CourseListSkeleton'; // <-- Pastikan ini
import EmptyState from '../../components/dashboard/EmptyState';
import PlatformStatsWidget from '../../components/dashboard/widgets/PlatformStatsWidget';
import UserManagementWidget from '../../components/dashboard/widgets/UserManagementWidget';

function AdminDashboard({ user }) {
  const { courses, loading: coursesLoading } = useCourses();
  const { users, loading: usersLoading } = useUsers();

  return (
    <div className="w-full">
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <WelcomeBanner
            badge="Dashboard Admin • Kontrol Penuh Platform"
            title={`Halo, ${user?.name} 👋`}
            description="Pantau seluruh aktivitas platform: user, course, dan konten dalam satu tempat."
          />

          <div className="mt-8">
            {!usersLoading && !coursesLoading && (
              <PlatformStatsWidget users={users} courses={courses} />
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Semua Course</h2>
                <Link
                  to="/dashboard/courses"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  + Buat Course
                </Link>
              </div>

              {coursesLoading && <CourseListSkeleton />}

              {!coursesLoading && courses.length === 0 && (
                <EmptyState message="Belum ada course di platform ini." />
              )}

              {!coursesLoading && courses.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <UserManagementWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;