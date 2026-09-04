import { Link } from 'react-router-dom';

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

export default CourseCard;