import { useParams } from 'react-router-dom';

function CourseDetail() {
  const { courseId } = useParams();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Detail Course</h1>
      <p className="mt-2 text-gray-600">Course ID: {courseId}</p>
    </div>
  );
}

export default CourseDetail;