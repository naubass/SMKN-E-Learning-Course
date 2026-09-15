import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import { useAuth } from '../../../store/AuthContext';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-50 text-purple-700',
  INSTRUCTOR: 'bg-blue-50 text-blue-700',
  STUDENT: 'bg-gray-100 text-gray-700',
};

function UserManagementWidget() {
  const { user: currentUser } = useAuth();
  const { users, loading, error, updateRole, removeUser } = useUsers();
  const [updatingId, setUpdatingId] = useState(null);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateRole(userId, newRole);
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
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Kelola User</h3>
        <span className="text-xs text-gray-400">{users.length} total</span>
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center py-6 text-gray-400">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{u.name}</p>
                <p className="truncate text-xs text-gray-500">{u.email}</p>
              </div>

              <select
                value={u.role}
                disabled={u.id === currentUser?.id || updatingId === u.id}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                className={`shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 ${ROLE_STYLES[u.role]}`}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="INSTRUCTOR">INSTRUCTOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <button
                onClick={() => handleDelete(u.id, u.name)}
                disabled={u.id === currentUser?.id || updatingId === u.id}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                title={u.id === currentUser?.id ? 'Tidak bisa hapus akun sendiri' : 'Hapus user'}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManagementWidget;