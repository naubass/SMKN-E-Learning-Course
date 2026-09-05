import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import api from '../utils/api';

const BACKEND_URL = 'http://localhost:5000';

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${BACKEND_URL}${thumbnail}`;
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kelas');
  const [searchTerm, setSearchTerm] = useState('');
  const tabsRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');

        setCourses(res.data);
      } catch (err) {
        console.error('Gagal memuat courses:', err);
        setError('Gagal memuat daftar course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(courses.map((c) => c.category).filter(Boolean))];
    return ['Semua Kelas', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory = course.category === selectedCategory || selectedCategory === 'Semua Kelas';
      const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
  }, [courses, selectedCategory, searchTerm]);

  const scrollTabs = (direction) => {
    if (!tabsRef.current) return;
    tabsRef.current.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Semua Course</h1>
      <p className="mt-1 text-gray-600">
        Pilih course sesuai minat dan mulai belajar sekarang.
      </p>
 
      {/* Category tabs */}
      <div className="relative mt-8 flex items-center border-b border-gray-200">
        <button
          onClick={() => scrollTabs('left')}
          className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Scroll kiri"
        >
          <ChevronLeft className="size-5" />
        </button>
 
        <div
          ref={tabsRef}
          className="flex gap-2 overflow-x-auto scroll-smooth px-1 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
 
        <button
          onClick={() => scrollTabs('right')}
          className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Scroll kanan"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
 
      {/* Search */}
      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari course..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
 
      {/* Course grid */}
      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4">
                <div className="h-24 w-32 shrink-0 rounded-lg bg-gray-200" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {!loading && error && (
        <p className="mt-10 text-center text-gray-500">{error}</p>
      )}
 
      {!loading && !error && filteredCourses.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          Tidak ada course yang cocok dengan pencarian kamu.
        </p>
      )}
 
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredCourses.map((course) => {
            const thumbnailUrl = resolveThumbnail(course.thumbnail);
            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group flex gap-4 rounded-xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 text-2xl font-bold text-gray-300">
                      {course.title?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
 
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {course.title}
                  </h3>
 
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                      {course.category}
                    </span>
                    <span>📘 {course.chapterCount ?? 0} Modul</span>
                  </div>
 
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>
 
                  {course.instructor?.name && (
                    <p className="mt-2 text-xs font-medium text-gray-500">
                      Oleh {course.instructor.name}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Courses;

