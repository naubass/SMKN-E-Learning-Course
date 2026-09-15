import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data); // backend bungkus response { message, data }
      setError(null);
    } catch (err) {
      console.error('Gagal memuat users:', err);
      setError('Gagal memuat daftar user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (userId, role) => {
    await api.put(`/users/${userId}`, { role });
    await fetchUsers(); // refresh list setelah update
  };

  const removeUser = async (userId) => {
    await api.delete(`/users/${userId}`);
    await fetchUsers();
  };

  return { users, loading, error, refetch: fetchUsers, updateRole, removeUser };
}