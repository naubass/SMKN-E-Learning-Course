import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk toggle lihat/sembunyikan password
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal login. Coba lagi.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Panel Kiri: Form Login */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        {/* Logo Sekolah di bagian atas */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img 
              src="/logo-sekolah.png" 
              alt="Logo Sekolah" 
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                SMKN 1 Kabupaten Tangerang
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Sekolah Berbasis Taruna
              </span>
            </div>
          </Link>
        </div>

        {/* Konten Utama Form */}
        <div className="mx-auto w-full max-w-md my-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Selamat Datang</h1>
            <p className="mt-2 text-sm text-slate-500">
              Masukkan email dan password akun terdaftar kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                placeholder="nama@email.com"
              />
            </div>

            {/* Input Password dengan Icon Mata */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-4 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-800 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 mt-2"
            >
              {submitting ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-blue-800 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>

        <div className="text-xs text-slate-400">
          © 2026 SMKN 1 Kabupaten Tangerang
        </div>
      </div>

      {/* Panel Kanan: Tempat Ilustrasi/Gambar */}
      <div className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <img
          src="/hero.webp"
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40" />
      </div>
    </div>
  );
}

export default Login;