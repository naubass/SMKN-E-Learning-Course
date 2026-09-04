function WelcomeBanner({ badge, title, description }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-md sm:px-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('/hero.webp')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />

      <div className="relative z-10 max-w-2xl">
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur-md">
          {badge}
        </span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-blue-100 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default WelcomeBanner;