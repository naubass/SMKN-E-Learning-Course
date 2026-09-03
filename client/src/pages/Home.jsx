import { Link } from 'react-router-dom';

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

function Home() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#F0653A]/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-orange-300">
              Platform Belajar SMK
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Asah keahlian SMK-mu, kapan saja, di mana saja
            </h1>

            <p className="mt-5 max-w-lg text-lg text-slate-300">
              Akses materi pembelajaran, video praktik, dan latihan yang
              disusun langsung oleh instruktur untuk membekali siswa dengan
              keterampilan siap kerja.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="rounded-lg bg-[#F0653A] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-[#d8552c]"
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
          </div>

          {/* Layered course-card mockup */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -left-6 top-8 w-full -rotate-3 rounded-2xl border border-white/10 bg-[#131B2E] p-5 shadow-2xl">
              <div className="h-2 w-16 rounded-full bg-white/10" />
              <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-[#F0653A]/25 to-transparent" />
              <div className="mt-4 h-2 w-3/4 rounded-full bg-white/10" />
              <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
            </div>

            <div className="relative rotate-2 rounded-2xl border border-white/10 bg-[#0F172A] p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-orange-300">
                  Rekayasa Perangkat Lunak
                </span>
                <span className="rounded-full bg-[#F0653A]/20 px-2 py-0.5 text-xs text-orange-300">
                  Baru
                </span>
              </div>

              <div className="mt-3 h-28 rounded-lg bg-gradient-to-br from-orange-500/20 via-transparent to-transparent" />

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Dasar Pemrograman Web
                  </p>
                  <p className="text-xs text-slate-400">
                    12 modul, 4 instruktur
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#F0653A]" />
              </div>

              <div className="mt-4 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 w-2/3 rounded-full bg-[#F0653A]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature rows */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F0653A]/10 text-[#F0653A]">
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
      </section>

      {/* CTA banner */}
      <section className="bg-[#0B1220]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Siap mulai belajar?
          </h2>
          <p className="mt-4 text-slate-300">
            Daftar sekarang dan akses semua course yang tersedia secara
            gratis.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-[#F0653A] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-[#d8552c]"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;