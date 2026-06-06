import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import CoursesSection from '@/components/home/CoursesSection';
import StudentWork from '@/components/home/StudentWork';
import Reviews from '@/components/home/Reviews';
import BlogSection from '@/components/home/BlogSection';
import Team from '@/components/home/Team';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <CoursesSection />
        <StudentWork />
        <Reviews />
        <BlogSection />
        <Team />
      </main>
      <Footer />
    </>
  );
}
