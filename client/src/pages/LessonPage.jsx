import { useParams } from 'react-router-dom';

function LessonPage() {
  const { lessonId } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Halaman Lesson</h1>
      <p className="mt-2 text-gray-600">Lesson ID: {lessonId}</p>
    </div>
  );
}

export default LessonPage;