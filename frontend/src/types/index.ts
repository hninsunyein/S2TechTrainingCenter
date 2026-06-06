export interface CourseStat {
  n: string;
  l: string;
}

export interface Lesson {
  id?: string;
  title: string;
  duration: string;
  isFree: boolean;
  videoUrl?: string;
  order?: number;
}

export interface Course {
  id: string;
  slug: string;
  emoji: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  shadow: string;
  thumb: string;
  badge: string;
  badgeColor: string;
  badgeText: string;
  tags: string[];
  price: string;
  priceShort: string;
  teacherId?: string;
  teacher?: Teacher;
  lessons: Lesson[];
  aboutPoints: string[];
  stats: CourseStat[];
  imageUrl?: string;
}

export interface TeacherSubject {
  icon: string;
  name: string;
}

export interface Teacher {
  id: string;
  slug: string;
  initials: string;
  name: string;
  role: string;
  color: string;
  cover: string;
  bio: string;
  subjects: TeacherSubject[];
  tags: string[];
  students: string;
  years: string;
  rating: string;
  imageUrl?: string;
}

export interface Student {
  id: string;
  emoji: string;
  category: string;
  bg: string;
  badge: string;
  badgeLabel: string;
  project: string;
  avatarColor: string;
  initials: string;
  name: string;
  className: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  stars: number;
  text: string;
  avatarColor: string;
  initials: string;
  authorName: string;
  authorRole: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  thumb: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  avatarColor: string;
  authorName: string;
  content?: string;
  imageUrl?: string;
}

export interface Enrollment {
  id?: string;
  courseName: string;
  courseId?: string;
  amount: string;
  paymentMethod: 'kpay' | 'wave' | 'aya' | 'bank';
  fullName: string;
  phoneNumber: string;
  transferRef?: string;
  screenshotUrl?: string;
  status?: 'pending' | 'verified' | 'rejected';
}

export type Theme = 'dark' | 'light';
export type Language = 'EN' | 'MM';
