// Handle upload gambar tunggal, kembalikan URL yang bisa diakses publik
export const handleImageUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diupload' });
        }

        // URL publik untuk akses gambar (lihat static serving di index.js)
        const imageUrl = `/uploads/images/${req.file.filename}`;

        return res.status(201).json({
            message: 'Gambar berhasil diupload',
            url: imageUrl,
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};