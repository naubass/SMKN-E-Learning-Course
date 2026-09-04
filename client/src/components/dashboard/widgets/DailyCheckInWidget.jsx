function DailyCheckInWidget() {
  const handleCheckIn = () => alert('Check-in hari ini berhasil dicatat!');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Daily Check-in</h3>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Aktif
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Bangun kebiasaan belajar harian yang konsisten dan terarah.
      </p>
      <button
        type="button"
        onClick={handleCheckIn}
        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
      >
        Tulis Check-in Hari Ini
      </button>
    </div>
  );
}

export default DailyCheckInWidget;