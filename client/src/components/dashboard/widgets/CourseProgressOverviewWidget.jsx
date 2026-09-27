import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import api from '../../../utils/api';

function CourseProgressOverviewWidget({ courses }) {
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courses.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAllProgress = async () => {
      try {
        const results = await Promise.all(
          courses.map((course) =>
            api.get(`/courses/${course.id}/students-progress`).then((res) => ({
              courseId: course.id,
              courseTitle: course.title,
              ...res.data,
            }))
          )
        );
        setCourseStats(results);
      } catch (err) {
        console.error('Gagal memuat progress course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProgress();
  }, [courses]);

  const getAveragePercentage = (students) => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + s.percentage, 0);
    return Math.round(sum / students.length);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900">Progress per Course</h3>

      {loading && (
        <div className="mt-4 flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {!loading && courseStats.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">Belum ada course untuk ditampilkan.</p>
      )}

      {!loading && courseStats.length > 0 && (
        <div className="mt-4 space-y-4">
          {courseStats.map((stat) => {
            const avg = getAveragePercentage(stat.students);
            return (
              <div key={stat.courseId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-gray-800 line-clamp-1">
                    <BookOpen className="size-3.5 shrink-0 text-gray-400" />
                    {stat.courseTitle}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500">
                    {stat.totalStudents} siswa
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-blue-600"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{avg}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseProgressOverviewWidget;