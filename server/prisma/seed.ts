import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcryptjs';

// Inisialisasi koneksi Seed Dummy ke database
const connectionString = process.env.DATABASE_URL || '';
const adapter = new PrismaMariaDb(connectionString);

// Masukkan adapter ke dalam constructor PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Memulai proses seeding data...');

  // Hapus data lama (opsional, untuk membersihkan database saat re-seed)
  await prisma.userProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Hash password default untuk semua dummy user (password: "password123")
  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // Buat Akun Dummy (Admin, Instructor, Student)
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator SMK',
      email: 'admin@smk.sch.id',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      name: 'Pak Budi, M.Kom.',
      email: 'budi@smk.sch.id',
      password: hashedPassword,
      role: 'INSTRUCTOR',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Siti Aisyah',
      email: 'siti@student.sch.id',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  console.log('Users berhasil dibuat!');

  // Buat Course Dummy beserta Chapter dan Lesson-nya
  const course1 = await prisma.course.create({
    data: {
      title: 'Pemrograman Web Dasar (HTML, CSS, & JavaScript)',
      description: 'Pelajari dasar-dasar pembuatan halaman web interaktif dari nol khusus untuk siswa SMK.',
      category: 'Teknik Komputer & Jaringan',
      instructorId: instructor.id,
      chapters: {
        create: [
          {
            title: 'Pengenalan HTML & Struktur Dokumen',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: 'Sejarah dan Pengenalan HTML',
                  content: 'HTML adalah singkatan dari HyperText Markup Language...',
                  orderIndex: 1,
                },
                {
                  title: 'Membuat Tag Pertama Anda',
                  content: 'Dalam materi ini kita akan belajar tag dasar seperti <html>, <head>, <body>...',
                  orderIndex: 2,
                },
              ],
            },
          },
          {
            title: 'Styling dengan CSS',
            orderIndex: 2,
            lessons: {
              create: [
                {
                  title: 'Mengenal Selektor CSS',
                  content: 'CSS digunakan untuk mempercantik tampilan elemen HTML...',
                  orderIndex: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Dasar Pemrograman JavaScript Modern',
      description: 'Menguasai logika pemrograman modern menggunakan JavaScript untuk Frontend maupun Backend.',
      category: 'Pengembangan Perangkat Lunak',
      instructorId: instructor.id,
      chapters: {
        create: [
          {
            title: 'Variabel dan Tipe Data',
            orderIndex: 1,
            lessons: {
              create: [
                {
                  title: 'Let, Const, dan Var',
                  content: 'Memahami cara mendeklarasikan variabel di JavaScript modern...',
                  orderIndex: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Courses, Chapters, & Lessons berhasil dibuat!');
  console.log('Seeding selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });