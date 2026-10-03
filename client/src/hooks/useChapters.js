import { useEffect, useState } from 'react';
import api from '../utils/api';

export function useChapters() {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchChapters = async () => {
            try {
                const res = await api.get('/chapters');
                if (mounted) setChapters(res.data);
            } catch (err) {
                console.error('Gagal memuat chapters:', err);
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchChapters();
        return () => {
            mounted = false;
        };
    }, []);
}