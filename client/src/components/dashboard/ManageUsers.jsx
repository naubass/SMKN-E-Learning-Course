import { useState, useMemo } from 'react';
import { Trash2, Loader2, UserPlus, X, Search, Filter, Shield, UserCheck, UserCog, Mail, Lock, User } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200',
  INSTRUCTOR: 'bg-blue-50 text-blue-700 border border-blue-200',
  STUDENT: 'bg-slate-100 text-slate-700 border border-slate-200',
};

// Form untuk Create atau Edit User
function UserForm({ initialData, mode, onSubmitted, onCancel }) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState(''); // Opsional saat edit
  const [role, setRole] = useState(initialData?.role || 'STUDENT');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'edit') {
        const payload = { name, email, role };
        if (password) payload.password = password; // Hanya kirim password jika diisi
        await api.put(`/users/${initialData.id}`, payload);
      } else {
        await api.post('/users', { name, email, password, role });
      }
      onSubmitted();
      onCancel();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg space-y-5 transition-all">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'edit' ? `Edit User: ${initialData.name}` : 'Tambah Pengguna Baru'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Kelola kredensial dan hak akses role platform.</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
          <X className="size-5" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <User className="size-3.5 text-gray-400" /> Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Contoh: Ahmad Rizki"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Mail className="size-3.5 text-gray-400" /> Alamat Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Contoh: ahmad@smkn1tangerang.sch.id"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Lock className="size-3.5 text-gray-400" /> Password {mode === 'edit' && <span className="font-normal text-gray-400">(Kosongkan jika tidak diubah)</span>}
          </label>
          <input
            type="password"
            required={mode === 'create'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Shield className="size-3.5 text-gray-400" /> Hak Akses Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-semibold text-gray-700 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
          >
            <option value="STUDENT">STUDENT (Siswa)</option>
            <option value="INSTRUCTOR">INSTRUCTOR (Pengajar)</option>
            <option value="ADMIN">ADMIN (Administrator)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Buat User Baru'}
        </button>
      </div>
    </form>
  );
}

function ManageUsers() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, refetch, updateRole, removeUser } = useUsers();
  
  // States untuk Form & Filter
  const [formMode, setFormMode] = useState(null); // null | 'create' | 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateRole(userId, newRole);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Yakin mau hapus akun "${userName}"? Aksi ini tidak bisa dibatalkan.`)) return;

    setUpdatingId(userId);
    try {
      await removeUser(userId);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setUpdatingId(null);
    }
  };

  // Logika Filter & Search
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const instructors = users.filter(u => u.role === 'INSTRUCTOR').length;
    const students = users.filter(u => u.role === 'STUDENT').length;
    return { total, admins, instructors, students };
  }, [users]);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 tracking-wide uppercase">
                Admin Control Center
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">{users.length} Akun Terdaftar</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-gray-900 tracking-tight">
              Manajemen Pengguna Platform
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data akun siswa, instruktur, serta hak akses administrator secara terpusat.
            </p>
          </div>

          {!formMode && (
            <button
              onClick={() => { setFormMode('create'); setEditingUser(null); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-gray-700 transition"
            >
              <UserPlus className="size-4" />
              Tambah User Baru
            </button>
          )}
        </div>

        {/* Statistik Ringkas */}
        {!formMode && (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Total Pengguna</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Shield className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Administrator</p>
                <p className="text-xl font-bold text-gray-900">{stats.admins}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserCog className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Pengajar / Guru</p>
                <p className="text-xl font-bold text-gray-900">{stats.instructors}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <User className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Siswa Terdaftar</p>
                <p className="text-xl font-bold text-gray-900">{stats.students}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Create / Edit */}
        {formMode === 'create' && (
          <div className="mt-6">
            <UserForm
              mode="create"
              onSubmitted={refetch}
              onCancel={() => setFormMode(null)}
            />
          </div>
        )}

        {formMode === 'edit' && editingUser && (
          <div className="mt-6">
            <UserForm
              mode="edit"
              initialData={editingUser}
              onSubmitted={refetch}
              onCancel={() => { setFormMode(null); setEditingUser(null); }}
            />
          </div>
        )}

        {/* Search & Filter Toolbar */}
        {!formMode && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama atau alamat email user..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Filter Role */}
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-400 shrink-0" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-semibold text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                >
                  <option value="ALL">Semua Role</option>
                  <option value="STUDENT">Siswa (STUDENT)</option>
                  <option value="INSTRUCTOR">Pengajar (INSTRUCTOR)</option>
                  <option value="ADMIN">Admin (ADMIN)</option>
                </select>
              </div>
            </div>

            {/* Table Users */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {loading && (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <Loader2 className="size-8 animate-spin text-blue-600" />
                </div>
              )}

              {error && <p className="p-12 text-center text-red-600 text-sm font-medium">{error}</p>}

              {!loading && !error && filteredUsers.length === 0 && (
                <div className="rounded-2xl bg-white p-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
                    <Search className="size-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Tidak ada user ditemukan</h3>
                  <p className="mt-1 text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter role Anda.</p>
                </div>
              )}

              {!loading && !error && filteredUsers.length > 0 && (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/75 text-xs uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">Nama Pengguna</th>
                      <th className="px-6 py-3.5 font-semibold">Email</th>
                      <th className="px-6 py-3.5 font-semibold">Role / Hak Akses</th>
                      <th className="px-6 py-3.5 font-semibold">Tanggal Bergabung</th>
                      <th className="px-6 py-3.5 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase shadow-sm">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{u.name}</span>
                              {u.id === currentUser?.id && (
                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Akun Anda</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            disabled={u.id === currentUser?.id || updatingId === u.id}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 transition shadow-sm ${ROLE_STYLES[u.role]}`}
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="INSTRUCTOR">INSTRUCTOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {new Date(u.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingUser(u); setFormMode('edit'); }}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm transition"
                              title="Edit user"
                            >
                              <UserCog className="size-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(u.id, u.name)}
                              disabled={u.id === currentUser?.id || updatingId === u.id}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40 transition"
                              title={u.id === currentUser?.id ? 'Tidak bisa hapus akun sendiri' : 'Hapus user'}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageUsers;