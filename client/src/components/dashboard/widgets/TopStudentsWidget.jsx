import { useState, useEffect } from 'react';
import { Loader2, Trophy } from 'lucide-react';
import api from '../../../utils/api';

function TopStudentsWidget({ courses }) {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courses.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAndMerge = async () => {
      try {
        const results = await Promise.all(
          courses.map((course) =>
            api.get(`/courses/${course.id}/students-progress`).then((res) => ({
              courseTitle: course.title,
              students: res.data.students,
            }))
          )
        );

        // Gabung semua siswa dari semua course, urutkan berdasarkan persentase tertinggi
        const merged = results.flatMap((r) =>
          r.students.map((s) => ({ ...s, courseTitle: r.courseTitle }))
        );
        merged.sort((a, b) => b.percentage - a.percentage);

        setTopStudents(merged.slice(0, 5)); // top 5 saja
      } catch (err) {
        console.error('Gagal memuat top students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMerge();
  }, [courses]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Trophy className="size-4 text-amber-500" />
        <h3 className="text-sm font-bold text-gray-900">Siswa Paling Aktif</h3>
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {!loading && topStudents.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">Belum ada siswa yang mulai belajar.</p>
      )}

      {!loading && topStudents.length > 0 && (
        <div className="mt-4 space-y-3">
          {topStudents.map((student, index) => (
            <div key={`${student.id}-${student.courseTitle}`} className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{student.name}</p>
                <p className="truncate text-xs text-gray-500">{student.courseTitle}</p>
              </div>
              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {student.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopStudentsWidget;