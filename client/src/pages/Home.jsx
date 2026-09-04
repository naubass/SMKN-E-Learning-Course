import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

const BACKEND_URL = 'http://localhost:5000';

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${BACKEND_URL}${thumbnail}`;
};

const features = [
  {
    title: 'Materi terstruktur',
    desc: 'Course disusun per bab dan modul, mudah diikuti dari dasar sampai mahir.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    ),
  },
  {
    title: 'Video & praktik',
    desc: 'Setiap lesson bisa dilengkapi video YouTube dan ilustrasi gambar dari instruktur.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    ),
  },
  {
    title: 'Lacak progress',
    desc: 'Pantau lesson mana yang sudah selesai dan berapa persen course sudah kamu tuntaskan.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

function CourseCard({ course }) {
  const thumbnailUrl = resolveThumbnail(course.thumbnail);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to={`/courses/${course.id}`}
        className="group w-72 shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-80 block"
      >
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 text-4xl font-bold text-gray-300">
              {course.title?.charAt(0) || '?'}
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
            {course.category}
          </span>
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-500">
            📅 {new Date(course.createdAt).getFullYear()}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-1">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
          {course.instructor?.name && (
            <p className="mt-3 text-xs font-medium text-gray-500">
              Oleh {course.instructor.name}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

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

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      className="bg-white"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('/hero.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/30 via-[#0B1220]/10 to-transparent" />

        <div className="pointer-events-none absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#F0653A]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-blue-300">
              Platform Belajar SMK
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Platform Pembelajaran Resmi SMKN 1 Kabupaten Tangerang
            </h1>

            <p className="mt-5 max-w-lg text-lg text-slate-300">
              Akses materi pembelajaran, video praktik, dan latihan yang
              disusun langsung oleh instruktur untuk membekali siswa dengan
              keterampilan siap kerja.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="rounded-lg bg-[#1533b9] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-[#2892d8]"
              >
                Mulai Belajar
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Daftar Gratis
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8">
              <div>
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-sm text-slate-400">Course</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">1500+</p>
                <p className="text-sm text-slate-400">Siswa</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">80+</p>
                <p className="text-sm text-slate-400">Instruktur</p>
              </div>
            </div>
          </motion.div>

          {/* Mockup Card dengan Gambar Aktif */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mx-auto hidden w-full max-w-md lg:block"
          >
            <div className="absolute -left-6 top-8 w-full -rotate-3 rounded-2xl border border-white/10 bg-[#131B2E]/90 backdrop-blur-md p-5 shadow-2xl">
              <div className="h-2 w-16 rounded-full bg-white/10" />
              <div className="mt-4 h-24 rounded-lg overflow-hidden relative">
                <img src="/hero.webp" alt="Card BG" className="h-full w-full object-cover opacity-60" />
              </div>
              <div className="mt-4 h-2 w-3/4 rounded-full bg-white/10" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
            </div>

            <div className="relative rotate-2 rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-md p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-300">
                  SMKN 1 Kabupaten Tangerang
                </span>
                <span className="rounded-full bg-[#F0653A]/20 px-2 py-0.5 text-xs text-blue-300">
                  Baru
                </span>
              </div>

              <div className="mt-3 h-32 rounded-xl overflow-hidden relative shadow-inner">
                <img src="/hero.webp" alt="Dasar Pemrograman Web" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Platform Belajar Gratis
                  </p>
                  <p className="text-xs text-slate-400">
                    12 modul, 4 instruktur
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#3ac6f0] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  ✓
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 w-2/3 rounded-full bg-[#3ac6f0]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Unggulan - Carousel */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Course
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Course Unggulan
            </h2>
            <p className="mt-2 text-gray-600">
              Pilih course dan mulai belajar dari sekarang.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Lihat Semua Course
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {loading && (
          <div className="mt-10 flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-72 shrink-0 animate-pulse rounded-xl border border-gray-200 p-4 sm:w-80">
                <div className="h-40 rounded-lg bg-gray-200" />
                <div className="mt-4 h-4 w-1/3 rounded bg-gray-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-full rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-10 text-center text-gray-500">{error}</p>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="mt-10 text-center text-gray-500">
            Belum ada course yang tersedia.
          </p>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="relative mt-10">
            <button
              onClick={() => scroll('left')}
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-gray-600 shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 sm:flex"
              aria-label="Sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2.5 text-gray-600 shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 sm:flex"
              aria-label="Berikutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </button>

            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Feature rows */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Kenapa belajar di sini?
            </h2>
            <p className="mt-4 text-gray-600">
              Semua yang kamu butuhkan untuk belajar dengan efektif, dalam
              satu platform.
            </p>
          </div>

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {features.map((f) => (
              <div key={f.title} className="flex gap-5 py-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F0653A]/10 text-[#3ab6f0]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    {f.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer / Bagian Akhir */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#0B1220] text-slate-300 border-t border-white/10"
      >
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
      </motion.footer>
    </motion.div>
  );
}

export default Home;