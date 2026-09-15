import { Users, BookOpen, GraduationCap } from 'lucide-react';

function PlatformStatsWidget({ users, courses }) {
  const totalStudents = users.filter((u) => u.role === 'STUDENT').length;
  const totalInstructors = users.filter((u) => u.role === 'INSTRUCTOR').length;
  const totalCourses = courses.length;

  const stats = [
    { label: 'Total Siswa', value: totalStudents, icon: GraduationCap, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Instruktur', value: totalInstructors, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Course', value: totalCourses, icon: BookOpen, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className={`inline-flex rounded-lg p-2.5 ${stat.color}`}>
            <stat.icon className="size-5" />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default PlatformStatsWidget;