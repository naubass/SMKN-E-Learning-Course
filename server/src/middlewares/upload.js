import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan folder uploads/images ada
const uploadDir = path.join(process.cwd(), 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Cek mimetype ATAU ekstensi file (lebih toleran, karena beberapa client
// kadang kirim mimetype yang tidak standar seperti application/octet-stream)
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    console.log('Upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        extension: ext,
    });

    const mimetypeValid = allowedMimeTypes.includes(file.mimetype);
    const extensionValid = allowedExtensions.includes(ext);

    if (mimetypeValid || extensionValid) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak didukung. Hanya gambar (jpeg, png, webp, gif) yang diperbolehkan.'), false);
    }
};

export const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});