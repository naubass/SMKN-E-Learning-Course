import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import CourseCard from '../../components/dashboard/CourseCard';
import CourseListSkeleton from '../../components/dashboard/CourseListSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';
import CourseProgressOverviewWidget from '../../components/dashboard/widgets/CourseProgressOverviewWidget';
import TopStudentsWidget from '../../components/dashboard/widgets/TopStudentsWidget';

function InstructorDashboard({ user }) {
  const { courses, loading } = useCourses();

  const myCourses = courses.filter((c) => c.instructor?.id === user.id);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <WelcomeBanner
          badge="Dashboard Pengajar • SMKN 1 Kab. Tangerang"
          title={`Halo, ${user?.name} 👋`}
          description="Kelola course kamu dan pantau progress belajar siswa dengan mudah di sini."
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Course Saya</h2>
              <Link
                to="/dashboard/courses"
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

          {/* Widget khusus instructor: progress siswa, bukan widget generic student */}
          <div className="space-y-6">
            {!loading && <CourseProgressOverviewWidget courses={myCourses} />}
            {!loading && <TopStudentsWidget courses={myCourses} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;