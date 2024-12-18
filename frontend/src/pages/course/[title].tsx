import { useRouter } from 'next/router';
import CoursePage from '@/components/course/coursePage';


const Course = () => {
  const router = useRouter();
  const { title } = router.query;

  if (!title || typeof title !== 'string') {
    return <div>Loading...</div>;
  }

  return <CoursePage courseTitle={decodeURIComponent(title)} />;
};

export default Course;