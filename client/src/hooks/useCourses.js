import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (mounted) setCourses(res.data);
      } catch (err) {
        console.error('Gagal memuat courses:', err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  return { courses, loading, error };
}