import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Loader2, Pencil, Trash2, Plus, X, Search, Filter, BookOpen, Layers, ListOrdered } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import api from '../../utils/api';

const BACKEND_URL = 'http://localhost:5000';

const resolveThumbnail = (thumbnail) => {
  if (!thumbnail) return null;
  if (thumbnail.startsWith('http')) return thumbnail;
  return `${BACKEND_URL}${thumbnail}`;
};

const emptyForm = { title: '', bio: '', description: '', category: '', thumbnail: '' };

function CourseForm({ initialData, mode, onSubmitted, onCancel }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm((prev) => ({ ...prev, thumbnail: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal upload gambar');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category) {
      setError('Title, description, dan category wajib diisi');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: form.title,
      bio: form.bio || undefined,
      description: form.description,
      category: form.category,
      thumbnail: form.thumbnail || undefined,
    };

    try {
      if (mode === 'edit') {
        await api.put(`/courses/${initialData.id}`, payload);
      } else {
        await api.post('/courses', payload);
      }
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan course');
    } finally {
      setSubmitting(false);
    }
  };

  const thumbnailPreview = resolveThumbnail(form.thumbnail);

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8 transition-all">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Informasi Course' : 'Buat Course Profesional Baru'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Lengkapi detail kurikulum dan materi pembelajaran.</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
          <X className="size-5" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <span className="font-semibold">Perhatian:</span> {error}
        </div>
      )}

      {/* Thumbnail upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail Course</label>
        <div className="mt-2 flex items-center gap-5">
          <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 shadow-inner">
            {uploadingThumbnail ? (
              <Loader2 className="size-6 animate-spin text-blue-600" />
            ) : thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Preview thumbnail" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="size-7 text-gray-300" />
            )}
          </div>
          <div className="space-y-2">
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition">
              <ImagePlus className="size-4" />
              {form.thumbnail ? 'Ganti Cover Gambar' : 'Upload Cover Gambar'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400">Format: JPG, PNG, WEBP, atau GIF (Maks. 5MB).</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Course</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={handleChange('title')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Contoh: Dasar Pemrograman Web Fullstack dengan React & Node.js"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tagline Singkat <span className="font-normal text-gray-400">(Opsional)</span>
          </label>
          <input
            type="text"
            value={form.bio}
            onChange={handleChange('bio')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Contoh: Kuasai dasar pembuatan aplikasi modern"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Bidang</label>
          <input
            type="text"
            required
            value={form.category}
            onChange={handleChange('category')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Contoh: Software Development, Data Science, UI/UX"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Lengkap Kurikulum</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={handleChange('description')}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
            placeholder="Jelaskan secara detail silabus, target peserta, dan keunggulan kelas ini..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting || uploadingThumbnail}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
        >
          {submitting ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Terbitkan Course'}
        </button>
      </div>
    </form>
  );
}

function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState(null); // null | 'create' | 'edit'
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedInstructor, setSelectedInstructor] = useState('ALL');

  const isAdmin = user?.role === 'ADMIN';

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses');
      const filtered = isAdmin
        ? res.data
        : res.data.filter((c) => c.instructor?.id === user?.id);
      setCourses(filtered);
      setError(null);
    } catch (err) {
      console.error('Gagal memuat courses:', err);
      setError('Gagal memuat daftar course');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // List kategori unik untuk filter dropdown
  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [courses]);

  // List instruktur unik (khusus Admin)
  const instructors = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      if (c.instructor) {
        map.set(c.instructor.id, c.instructor.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [courses]);

  // Logika Filter & Search Gabungan
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || course.category === selectedCategory;

      const matchesInstructor =
        selectedInstructor === 'ALL' || course.instructor?.id === selectedInstructor;

      return matchesSearch && matchesCategory && matchesInstructor;
    });
  }, [courses, searchQuery, selectedCategory, selectedInstructor]);

  const handleFormSubmitted = () => {
    setFormMode(null);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditingCourse({
      id: course.id,
      title: course.title,
      bio: course.bio || '',
      description: course.description,
      category: course.category,
      thumbnail: course.thumbnail || '',
    });
    setFormMode('edit');
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (!confirm(`Yakin mau hapus course "${courseTitle}"? Semua bab dan materi di dalamnya ikut terhapus.`)) return;

    setDeletingId(courseId);
    try {
      await api.delete(`/courses/${courseId}`);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus course');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 tracking-wide uppercase">
                {isAdmin ? 'Admin Portal' : 'Instructor Center'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-medium text-gray-500">{courses.length} Total Course</span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-gray-900 tracking-tight">
              {isAdmin ? 'Manajemen Seluruh Course' : 'Kelola Course Saya'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Pantau kurikulum, publikasikan kelas baru, dan kelola materi pembelajaran platform.
            </p>
          </div>

          {!formMode && (
            <button
              onClick={() => setFormMode('create')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-gray-700 transition"
            >
              <Plus className="size-4" />
              Buat Course Baru
            </button>
          )}
        </div>

        {/* Quick Stats Summary */}
        {!formMode && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Course Ditampilkan</p>
                <p className="text-xl font-bold text-gray-900">{filteredCourses.length} <span className="text-xs font-normal text-gray-500">dari {courses.length}</span></p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Layers className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Kategori Aktif</p>
                <p className="text-xl font-bold text-gray-900">{categories.length - 1} Kategori</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Create / Edit */}
        {formMode === 'create' && (
          <div className="mt-6">
            <CourseForm
              mode="create"
              initialData={emptyForm}
              onSubmitted={handleFormSubmitted}
              onCancel={() => setFormMode(null)}
            />
          </div>
        )}

        {formMode === 'edit' && editingCourse && (
          <div className="mt-6">
            <CourseForm
              mode="edit"
              initialData={editingCourse}
              onSubmitted={handleFormSubmitted}
              onCancel={() => {
                setFormMode(null);
                setEditingCourse(null);
              }}
            />
          </div>
        )}

        {/* Main Content Area: Search & Filter Toolbar */}
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
                  placeholder="Cari berdasarkan judul atau kategori course..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter Kategori */}
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-gray-400 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="ALL">Semua Kategori</option>
                    {categories.filter(c => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Instruktur (Khusus ADMIN) */}
                {isAdmin && instructors.length > 0 && (
                  <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="ALL">Semua Instruktur</option>
                    {instructors.map((ins) => (
                      <option key={ins.id} value={ins.id}>
                        {ins.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Courses Table / List */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {loading && (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  <Loader2 className="size-8 animate-spin text-blue-600" />
                </div>
              )}

              {!loading && error && (
                <div className="p-12 text-center text-red-600 text-sm font-medium">{error}</div>
              )}

              {!loading && !error && filteredCourses.length === 0 && (
                <div className="rounded-2xl bg-white p-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-4">
                    <Search className="size-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Tidak ada course ditemukan</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Coba sesuaikan kata kunci pencarian atau filter kategori Anda.
                  </p>
                </div>
              )}

              {!loading && !error && filteredCourses.length > 0 && (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50/75 text-xs uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">Course & Kurikulum</th>
                      <th className="px-6 py-3.5 font-semibold">Kategori</th>
                      <th className="px-6 py-3.5 font-semibold">Total Bab</th>
                      {isAdmin && <th className="px-6 py-3.5 font-semibold">Instruktur</th>}
                      <th className="px-6 py-3.5 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => {
                      const thumbnailUrl = resolveThumbnail(course.thumbnail);
                      return (
                        <tr key={course.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200 shadow-sm">
                                {thumbnailUrl ? (
                                  <img src={thumbnailUrl} alt={course.title} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-sm font-bold text-blue-600">
                                    {course.title?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link
                                  to={`/courses/${course.id}`}
                                  className="font-bold text-gray-900 hover:text-blue-600 hover:underline line-clamp-1"
                                >
                                  {course.title}
                                </Link>
                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                  {course.bio || course.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                            {course.chapterCount ?? 0} Bab
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 text-gray-600 font-medium">
                              {course.instructor?.name || 'Admin'}
                            </td>
                          )}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* TAMBAHAN: tombol ke halaman Manage Chapters, pakai course.id asli */}
                              <Link
                                to={`/dashboard/courses/${course.id}/chapters`}
                                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 shadow-sm transition"
                                title="Kelola bab & materi"
                              >
                                <ListOrdered className="size-4" />
                              </Link>
                              <button
                                onClick={() => handleEdit(course)}
                                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 shadow-sm transition"
                                title="Edit course"
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(course.id, course.title)}
                                disabled={deletingId === course.id}
                                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40 transition"
                                title="Hapus course"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default ManageCourses;