import multer from 'multer';

// Middleware khusus untuk menangkap error dari multer (upload)
// supaya response tetap JSON, bukan HTML default Express
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Error bawaan multer, misal file terlalu besar
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    if (err) {
        // Error custom dari fileFilter (tipe file tidak didukung)
        return res.status(400).json({ message: err.message });
    }
    next();
};