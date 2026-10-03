import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

function ManageChapters() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
      setError(null);
    } catch (err) {
      console.error('Gagal memuat course:', err);
      setError('Gagal memuat course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    setCreating(true);
    try {
      await api.post(`/courses/${courseId}/chapters`, { title: newChapterTitle });
      setNewChapterTitle('');
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal membuat chapter');
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (chapter) => {
    setEditingId(chapter.id);
    setEditingTitle(chapter.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = async (chapterId) => {
    if (!editingTitle.trim()) return;

    setSavingId(chapterId);
    try {
      await api.put(`/chapters/${chapterId}`, { title: editingTitle });
      setEditingId(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan perubahan');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (chapterId, chapterTitle) => {
    if (!confirm(`Yakin mau hapus bab "${chapterTitle}"? Semua materi di dalamnya ikut terhapus.`)) return;

    setDeletingId(chapterId);
    try {
      await api.delete(`/chapters/${chapterId}`);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus chapter');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center px-4 py-16 text-gray-400">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-red-600">{error || 'Course tidak ditemukan'}</p>
        <Link to="/dashboard/courses" className="mt-4 inline-block text-blue-600 hover:underline">
          Kembali ke daftar course
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard/courses"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Course Saya
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="mt-1 text-gray-600">Kelola bab (chapter) untuk course ini.</p>

        {/* Form tambah chapter */}
        <form onSubmit={handleCreateChapter} className="mt-6 flex gap-3">
          <input
            type="text"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            placeholder="Judul bab baru, contoh: Pengenalan Machine Learning"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={creating || !newChapterTitle.trim()}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            {creating ? 'Menyimpan...' : 'Tambah Bab'}
          </button>
        </form>

        {/* List chapter */}
        <div className="mt-6 space-y-3">
          {course.chapters?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">Belum ada bab. Tambahkan bab pertama di atas.</p>
            </div>
          )}

          {course.chapters?.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                {index + 1}
              </span>

              {editingId === chapter.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    autoFocus
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => saveEdit(chapter.id)}
                    disabled={savingId === chapter.id}
                    className="shrink-0 rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50"
                    title="Simpan"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                    title="Batal"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{chapter.title}</p>
                    <p className="text-xs text-gray-500">{chapter.lessons?.length ?? 0} materi</p>
                  </div>
                  <button
                    onClick={() => startEdit(chapter)}
                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit judul bab"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chapter.id, chapter.title)}
                    disabled={deletingId === chapter.id}
                    className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Hapus bab"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageChapters;