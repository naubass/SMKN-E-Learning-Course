import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, PlayCircle, BookOpen, User, CheckCircle2, Award, Clock } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import api from '../utils/api';

const BACKEND_URL = 'http://localhost:5000';

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${BACKEND_URL}${thumbnail}`;
};

function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('deskripsi');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Gagal memuat course:', err);
        setError('Course tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const totalLessons =
    course?.chapters?.reduce((sum, ch) => sum + ch.lessons.length, 0) ?? 0;

  // FIX: cari chapter PERTAMA yang punya lesson (bukan asumsi chapters[0] pasti ada lesson)
  const firstLesson = course?.chapters?.find((ch) => ch.lessons.length > 0)?.lessons?.[0];
  const hasContent = Boolean(firstLesson);

  const handleMulaiBelajar = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (firstLesson) {
      navigate(`/lessons/${firstLesson.id}`);
    }
  };

  const handleLessonClick = (lessonId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-48 rounded-2xl bg-gray-200" />
          <div className="h-6 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-gray-500">{error || 'Course tidak ditemukan'}</p>
        <Link to="/courses" className="mt-4 inline-block text-blue-600 hover:underline">
          Kembali ke daftar course
        </Link>
      </div>
    );
  }

  const thumbnailUrl = resolveThumbnail(course.thumbnail);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        {/* Hero Header ala Dicoding */}
        <div className="bg-[#0B1220] text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url('/hero.webp')` }} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-blue-500/20 border border-blue-400/30 px-3.5 py-1 text-xs font-semibold text-blue-300">
                {course.category}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 text-base text-slate-300 leading-relaxed line-clamp-2">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  {course.chapters?.length ?? 0} Bab &middot; {totalLessons} Materi
                </span>
                {course.instructor?.name && (
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    {course.instructor.name}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  Sertifikat Kelulusan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sub-Navbar (Tabs & CTA Button) */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3">
            <div className="flex gap-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('deskripsi')}
                className={`py-2 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === 'deskripsi'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Deskripsi Kelas
              </button>
              <button
                onClick={() => setActiveTab('silabus')}
                className={`py-2 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                  activeTab === 'silabus'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Silabus ({totalLessons} Materi)
              </button>
            </div>

            {/* Tombol Aksi Cepat di Sticky Nav */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-left sm:text-right hidden sm:block">
                <span className="text-xs text-gray-400 block">Akses Kelas</span>
                <span className="text-sm font-bold text-emerald-600">100% Gratis</span>
              </div>
              <button
                onClick={handleMulaiBelajar}
                disabled={!hasContent}
                title={!hasContent ? 'Course ini belum punya materi' : undefined}
                className="rounded-xl bg-[#1533b9] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#2892d8] whitespace-nowrap disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
              >
                {!hasContent ? 'Materi Belum Tersedia' : user ? 'Mulai Belajar' : 'Login Untuk Akses Materi'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Kolom Kiri: Detail / Silabus */}
            <div className="lg:col-span-2">
              {activeTab === 'deskripsi' && (
                <div className="space-y-8">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900">Tentang Kelas Ini</h2>
                    <p className="mt-4 leading-relaxed text-gray-600 whitespace-pre-line">
                      {course.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-100 p-5 bg-white shadow-xs flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Materi Terstruktur</h4>
                        <p className="text-xs text-gray-500 mt-1">Disusun per bab dan modul dari tingkat dasar hingga mahir.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-5 bg-white shadow-xs flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Sertifikat Resmi</h4>
                        <p className="text-xs text-gray-500 mt-1">Dapatkan sertifikat kelulusan setelah menuntaskan seluruh modul.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-5 bg-white shadow-xs flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Kuis Interaktif</h4>
                        <p className="text-xs text-gray-500 mt-1">Uji pemahaman di setiap akhir bab dengan latihan soal yang menantang.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 p-5 bg-white shadow-xs flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Mini Project</h4>
                        <p className="text-xs text-gray-500 mt-1">Praktikkan langsung ilmu yang didapat lewat studi kasus siap kerja.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'silabus' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Kurikulum & Silabus Kelas</h2>
                  {(!course.chapters || course.chapters.length === 0) && (
                    <p className="text-gray-500">Silabus belum tersedia untuk course ini.</p>
                  )}

                  {course.chapters?.map((chapter, index) => (
                    <div key={chapter.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs">
                      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Bab {index + 1}</span>
                          <h3 className="text-base font-bold text-gray-900 mt-0.5">{chapter.title}</h3>
                        </div>
                        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs">
                          {chapter.lessons.length} materi
                        </span>
                      </div>

                      {chapter.lessons.length === 0 ? (
                        <p className="px-6 py-4 text-sm text-gray-400">Belum ada materi di bab ini.</p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {chapter.lessons.map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                onClick={() => handleLessonClick(lesson.id)}
                                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm transition hover:bg-blue-50/40 group"
                              >
                                <div className="flex items-center gap-3.5">
                                  {user ? (
                                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                                      <PlayCircle className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                                      <Lock className="w-4 h-4" />
                                    </div>
                                  )}
                                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition">{lesson.title}</span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-blue-500">Mulai &rarr;</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kolom Kanan: Card Thumbnail & Informasi Kelas */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                <div className="h-48 w-full overflow-hidden rounded-xl bg-gray-100 relative shadow-inner">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={course.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 text-4xl font-bold text-gray-300">
                      {course.title?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Investasi Belajar</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-600">Gratis</span>
                  </div>
                </div>

                <button
                  onClick={handleMulaiBelajar}
                  disabled={!hasContent}
                  title={!hasContent ? 'Course ini belum punya materi' : undefined}
                  className="w-full rounded-xl bg-[#1533b9] px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#2892d8] text-center disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none disabled:hover:bg-gray-300"
                >
                  {!hasContent ? 'Materi Belum Tersedia' : user ? 'Mulai Belajar Sekarang' : 'Login & Belajar Sekarang'}
                </button>

                {!hasContent && (
                  <p className="text-center text-xs text-amber-600">
                    Instruktur belum menambahkan materi untuk course ini.
                  </p>
                )}

                {hasContent && !user && (
                  <p className="text-center text-xs text-gray-500">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                      Masuk di sini
                    </Link>
                  </p>
                )}

                <div className="border-t border-gray-100 pt-5 space-y-3 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" /> Total Modul</span>
                    <span className="font-semibold text-gray-900">{totalLessons} Pelajaran</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Award className="w-4 h-4 text-gray-400" /> Sertifikat</span>
                    <span className="font-semibold text-gray-900">Tersedia</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> Akses</span>
                    <span className="font-semibold text-gray-900">Selamanya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Bagian Akhir */}
      <footer className="bg-[#0B1220] text-slate-300 border-t border-white/10 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Kolom 1: Profil Singkat */}
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                <div>
                  <h3 className="text-base font-bold text-white">SMKN 1 Kab. Tangerang</h3>
                  <p className="text-xs text-slate-400">Sekolah Berbasis Taruna</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Sekolah Menengah Kejuruan Negeri berbasis taruna yang berkomitmen mencetak lulusan profesional dan siap industri.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition hover:bg-white/10">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Kolom 2: Navigasi */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/" className="text-slate-400 transition hover:text-white">Profil Sekolah</Link></li>
                <li><Link to="/" className="text-slate-400 transition hover:text-white">Prestasi Siswa</Link></li>
                <li><Link to="/courses" className="text-slate-400 transition hover:text-white">Konsentrasi Keahlian</Link></li>
                <li><Link to="/" className="text-slate-400 transition hover:text-white">Berita</Link></li>
                <li><Link to="/" className="text-slate-400 transition hover:text-white">Info SPMB</Link></li>
                <li><Link to="/" className="text-slate-400 transition hover:text-white">Tracer Study</Link></li>
                <li><Link to="/" className="text-slate-400 transition hover:text-white">E-Rapor Online</Link></li>
              </ul>
            </div>

            {/* Kolom 3: Program Keahlian */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Program Keahlian</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="text-slate-400">Teknik Instalasi Tenaga Listrik</li>
                <li className="text-slate-400">Teknik Elektronika Industri</li>
                <li className="text-slate-400">Teknik Pendingin & Tata Udara</li>
                <li className="text-slate-400">Teknik Komputer & Jaringan</li>
                <li className="text-slate-400">Desain Komunikasi Visual</li>
                <li className="text-slate-400">Teknik Sepeda Motor</li>
              </ul>
            </div>

            {/* Kolom 4: Hubungi Kami */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Hubungi Kami</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 shrink-0 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" /></svg>
                  <span>Perumahan Mekar Asri, Jalan Desa Peusar, Kec. Panongan, Kabupaten Tangerang, Banten 15711</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  <span>(021) 5960-1234</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  <span>admin@smkn1kabtangerang.sch.id</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Senin - Jumat: 07:00 - 15:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Scroll Top */}
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>&copy; 2026 SMKN 1 Kab. Tangerang | Powered by <span className="text-white font-medium">Khaiya Media Teknologi</span></p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1533b9] text-white shadow-lg transition hover:bg-[#2892d8]"
              aria-label="Kembali ke atas"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CourseDetail;