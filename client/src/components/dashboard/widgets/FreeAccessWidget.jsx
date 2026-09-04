function FreeAccessWidget() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Akses Tanpa Batas</h3>
          <p className="text-xs text-gray-500">Semua modul & materi terbuka</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100">
        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
          Platform pembelajaran resmi SMKN 1 Kabupaten Tangerang dapat diakses sepenuhnya secara gratis oleh seluruh siswa/i.
        </p>
      </div>
    </div>
  );
}

export default FreeAccessWidget;