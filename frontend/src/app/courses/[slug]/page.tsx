import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CourseDetail from '@/components/courses/CourseDetail';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <Navbar />
      <main className="pt-[60px]">
        <ErrorBoundary>
          <CourseDetail slug={slug} />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
