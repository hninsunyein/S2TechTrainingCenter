import type { Course, Teacher, Student, Review, BlogPost } from '@/types';

export const FALLBACK_COURSES: Course[] = [
  {
    id: 'scratch-level-i', slug: 'scratch-level-i', emoji: '🐱', category: 'Coding · Scratch',
    name: 'Scratch Level I', tagline: 'Scratch Programming for Starters',
    description: 'Start your coding journey with Scratch! Learn sprites, motion, loops, and events using colorful visual blocks.',
    color: '#0ea5c8', shadow: 'rgba(14,165,200,.18)', thumb: 'linear-gradient(135deg,#0c1e30,#0a2a3a)',
    badge: 'Level I', badgeColor: 'rgba(14,165,200,.2)', badgeText: '#7dd3fc',
    tags: ['Age 7+', '20 Lessons', '2 Months', 'Online'],
    price: '80,000 Ks / month', priceShort: '80,000 Ks',
    stats: [{ n: '20', l: 'Lessons' }, { n: '7+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
    aboutPoints: ['Learn to code with Scratch blocks', 'Build a mini-game project', 'Create animations and stories'],
    lessons: [{ title: 'Sample Scratch', duration: '', isFree: true }],
  },
  {
    id: 'scratch-level-ii', slug: 'scratch-level-ii', emoji: '🎮', category: 'Coding · Scratch',
    name: 'Scratch Level II', tagline: 'Scratch Programming for Movers',
    description: 'Take your Scratch skills further! Design complex games with variables, conditionals, and clones.',
    color: '#22c55e', shadow: 'rgba(34,197,94,.18)', thumb: 'linear-gradient(135deg,#0d2018,#0a2a16)',
    badge: 'Level II', badgeColor: 'rgba(34,197,94,.2)', badgeText: '#86efac',
    tags: ['Age 12+', '20 Lessons', '2.5 Months', 'Online'],
    price: '100,000 Ks / month', priceShort: '100,000 Ks',
    stats: [{ n: '20', l: 'Lessons' }, { n: '12+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
    aboutPoints: ['Learn to code with Scratch Movers', 'Build a game project', 'Create animations and stories'],
    lessons: [{ title: 'Scratch Level II', duration: '', isFree: true }],
  },
  {
    id: 'python-basic', slug: 'python-basic', emoji: '🐍', category: 'Coding · Python',
    name: 'Python Basic', tagline: 'Programming Language for Beginners',
    description: 'Write real Python code from day one! Learn variables, functions, loops, and problem-solving.',
    color: '#a78bfa', shadow: 'rgba(167,139,250,.18)', thumb: 'linear-gradient(135deg,#12102a,#1a1040)',
    badge: 'Basic', badgeColor: 'rgba(167,139,250,.2)', badgeText: '#c4b5fd',
    tags: ['Age 12+', '15 Lessons', '2.5 Months', 'Online'],
    price: '80,000 Ks / month', priceShort: '80,000 Ks',
    stats: [{ n: '15', l: 'Lessons' }, { n: '12+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
    aboutPoints: ['Learn to code with Python', 'Build a real world project', 'Create functions and class'],
    lessons: [],
  },
  {
    id: 'evc-class', slug: 'evc-class', emoji: '🔤', category: 'Language · English',
    name: 'EVC Class', tagline: 'Cambridge Vocabulary In Use (Elementary)',
    description: 'Build English vocabulary through pictures, audio, flashcards, and quizzes. Available online via Zoom.',
    color: '#f59e0b', shadow: 'rgba(245,158,11,.18)', thumb: 'linear-gradient(135deg,#1e1608,#2a1e08)',
    badge: 'EVC', badgeColor: 'rgba(245,158,11,.2)', badgeText: '#fcd34d',
    tags: ['Age 12+', '20 Lessons', '3 Months', 'Online'],
    price: '80,000 Ks / month', priceShort: '80,000 Ks',
    stats: [{ n: '20', l: 'Lessons' }, { n: '12+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
    aboutPoints: ['Learn English with Fun', 'Happy Studying', 'Do activities with English Games'],
    lessons: [],
  },
];

export const FALLBACK_TEACHERS: Teacher[] = [
  {
    id: 'hs', slug: 'hs', initials: 'HS', name: 'Tr. Hnin Su', role: 'Lead Instructor',
    color: 'linear-gradient(135deg,#0ea5c8,#0c4a6e)', cover: 'linear-gradient(135deg,#0c2030,#082840)',
    bio: 'Founder of S2 Tech. Leads EVC and Coding classes with 3+ years of experience teaching children through creative, hands-on methods.',
    subjects: [{ icon: '🔤', name: 'EVC — English Vocabulary' }, { icon: '🐱', name: 'Scratch Level 1 and 2' }, { icon: '🐍', name: 'Python Basic' }],
    tags: ['Online & Offline', 'Ages 5–14'], students: '50+', years: '3+', rating: '5.0',
  },
  {
    id: 'kt', slug: 'kt', initials: 'KS', name: 'Tr. Kyal Sin', role: 'Coding Instructor',
    color: 'linear-gradient(135deg,#7c3aed,#4c1d95)', cover: 'linear-gradient(135deg,#1a0a30,#22103a)',
    bio: 'Teaches Scratch Level 1 and 2 and Python Basic. Specializes in hands-on project building and interactive game design for kids.',
    subjects: [{ icon: '🐱', name: 'Scratch Level 1' }, { icon: '🎮', name: 'Scratch Level 2' }, { icon: '🐍', name: 'Python Basic' }],
    tags: ['Online & Offline', 'Ages 9–14'], students: '30+', years: '2+', rating: '4.9',
  },
  {
    id: 'tm', slug: 'tm', initials: 'Z', name: 'Tr. Zaw', role: 'English Vocabulary Instructor',
    color: 'linear-gradient(135deg,#f59e0b,#b45309)', cover: 'linear-gradient(135deg,#2a1804,#301e06)',
    bio: 'Specializes in EVC — teaching English vocabulary using picture-based and audio methods. Makes English fun and effective for young children.',
    subjects: [{ icon: '🔤', name: 'EVC — Elementary Vocabulary' }, { icon: '🔊', name: 'Phonics and Pronunciation' }, { icon: '📖', name: 'Reading and Word Building' }],
    tags: ['Online (Zoom)', 'Ages 5–12'], students: '25+', years: '2', rating: '5.0',
  },
];

export const FALLBACK_STUDENTS: Student[] = [
  { id: '1', emoji: '🌳', category: 'paint', bg: 'linear-gradient(135deg,#1a2a14,#0d1a0a)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Apple Tree Drawing', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', initials: 'MK', name: 'Ma Khin Myat', className: 'Scratch L1 · Age 8' },
  { id: '2', emoji: '🐞', category: 'paint', bg: 'linear-gradient(135deg,#2a1020,#180a18)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Ladybug Illustration', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: 'AT', name: 'Aung Thu', className: 'Scratch L1 · Age 7' },
  { id: '3', emoji: '😊', category: 'paint', bg: 'linear-gradient(135deg,#2a2010,#1a1408)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Smiley Face Character', avatarColor: 'linear-gradient(135deg,#22c55e,#16a34a)', initials: 'TN', name: 'Thant Naing', className: 'Scratch L1 · Age 9' },
  { id: '4', emoji: '🌈', category: 'paint', bg: 'linear-gradient(135deg,#0a1428,#081020)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Rainbow Scene', avatarColor: 'linear-gradient(135deg,#a78bfa,#7c3aed)', initials: 'SS', name: 'Su Su Win', className: 'Scratch L1 · Age 8' },
  { id: '5', emoji: '🐱', category: 'scratch', bg: 'linear-gradient(135deg,#0a1e2a,#081828)', badge: 'scratch-b', badgeLabel: 'Scratch', project: 'Mini Game Project', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0c4a6e)', initials: 'KK', name: 'Kaung Ko', className: 'Scratch L1 · Age 10' },
  { id: '6', emoji: '🎮', category: 'scratch', bg: 'linear-gradient(135deg,#0a2018,#081610)', badge: 'scratch-b', badgeLabel: 'Scratch', project: 'Animation Loop', avatarColor: 'linear-gradient(135deg,#f472b6,#db2777)', initials: 'NM', name: 'Nwe Moe', className: 'Scratch L2 · Age 11' },
  { id: '7', emoji: '⭐', category: 'scratch', bg: 'linear-gradient(135deg,#181028,#100820)', badge: 'scratch-b', badgeLabel: 'Scratch', project: 'Star Catcher Game', avatarColor: 'linear-gradient(135deg,#fb923c,#ea580c)', initials: 'YK', name: 'Ye Kyaw', className: 'Scratch L2 · Age 12' },
  { id: '8', emoji: '🗺️', category: 'ppt', bg: 'linear-gradient(135deg,#1a0a28,#120822)', badge: 'ppt-b', badgeLabel: 'PPT', project: 'Land of Myanmar', avatarColor: 'linear-gradient(135deg,#a78bfa,#6d28d9)', initials: 'KT', name: 'Khit Thazin Maung', className: 'Python · Grade 8' },
  { id: '9', emoji: '🍜', category: 'ppt', bg: 'linear-gradient(135deg,#201408,#180e04)', badge: 'ppt-b', badgeLabel: 'PPT', project: 'Burmese Traditional Food', avatarColor: 'linear-gradient(135deg,#f59e0b,#b45309)', initials: 'WW', name: 'Win Win Htun', className: 'Python · Grade 7' },
  { id: '10', emoji: '🎨', category: 'ppt', bg: 'linear-gradient(135deg,#0a1a20,#081418)', badge: 'ppt-b', badgeLabel: 'PPT', project: 'Vincent Van Gogh', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', initials: 'ZM', name: 'Zin Mar Oo', className: 'Scratch L2 · Age 13' },
  { id: '11', emoji: '💻', category: 'ppt', bg: 'linear-gradient(135deg,#1a180a,#141208)', badge: 'ppt-b', badgeLabel: 'PPT', project: 'Computer MC Test', avatarColor: 'linear-gradient(135deg,#22c55e,#16a34a)', initials: 'HH', name: 'Htet Htet Aung', className: 'Scratch L1 · Age 9' },
];

export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', stars: 5, text: 'My son built his own mini game after Scratch Level 1! Teachers are patient and lessons are very engaging. Highly recommended!', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: 'AK', authorName: 'Ma Aye Khaing', authorRole: 'Parent · Child age 9' },
  { id: '2', stars: 5, text: 'The EVC class is excellent — picture-based teaching makes it so easy for my daughter to remember words!', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', initials: 'KK', authorName: 'Ko Kyaw Kyaw', authorRole: 'Parent · Child age 11' },
  { id: '3', stars: 5, text: 'I am in Python Basic and can make the computer do what I say. S2 Tech makes learning feel like a game!', avatarColor: 'linear-gradient(135deg,#a78bfa,#7c3aed)', initials: 'TH', authorName: 'Thant Htet', authorRole: 'Student · Age 13' },
  { id: '4', stars: 5, text: 'My 7-year-old drew beautiful pictures in Scratch Paint. Tr. Hnin Su teaches with so much care and creativity!', avatarColor: 'linear-gradient(135deg,#f472b6,#db2777)', initials: 'MN', authorName: 'Ma Nilar Win', authorRole: 'Parent · Age 7 · Scratch L1' },
  { id: '5', stars: 5, text: 'Seeing my son present his PowerPoint about Myanmar was a proud moment. S2 Tech builds real confidence!', avatarColor: 'linear-gradient(135deg,#22c55e,#16a34a)', initials: 'SK', authorName: 'Ko Si Thu Kyaw', authorRole: 'Parent · Grade 8' },
  { id: '6', stars: 5, text: 'The reward system after passing the Basic Computer test really motivated my son. He practices daily!', avatarColor: 'linear-gradient(135deg,#fb923c,#ea580c)', initials: 'WT', authorName: 'Ma Win Thida', authorRole: 'Parent · Son age 10' },
];

export const FALLBACK_BLOG: BlogPost[] = [
  { id: '1', slug: '5-fun-scratch-projects', thumb: 'linear-gradient(135deg,#0c1e30,#0a2a40)', category: 'Scratch', categoryColor: JSON.stringify({ background: 'rgba(14,165,200,.2)', border: '1px solid rgba(14,165,200,.35)', color: 'var(--teal)' }), date: 'May 10, 2025', readTime: '4 min read', title: '5 Fun Scratch Projects for Beginners', excerpt: 'New to Scratch? Here are 5 easy and creative projects to build confidence and spark curiosity in young coders.', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', authorName: 'Tr. Hnin Su' },
  { id: '2', slug: 'english-vocab-at-home', thumb: 'linear-gradient(135deg,#1a1408,#2a2010)', category: 'English', categoryColor: JSON.stringify({ background: 'rgba(245,158,11,.2)', border: '1px solid rgba(245,158,11,.35)', color: 'var(--gold)' }), date: 'Apr 28, 2025', readTime: '3 min read', title: 'How to Help Your Child Learn English Vocabulary at Home', excerpt: 'Simple daily habits that parents can use to reinforce English vocabulary outside of class time.', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', authorName: 'Tr. Thida Maung' },
  { id: '3', slug: 'python-for-kids', thumb: 'linear-gradient(135deg,#12102a,#1a1040)', category: 'Python', categoryColor: JSON.stringify({ background: 'rgba(167,139,250,.2)', border: '1px solid rgba(167,139,250,.35)', color: 'var(--purple)' }), date: 'Apr 15, 2025', readTime: '5 min read', title: 'Why Python is the Best First Programming Language for Kids', excerpt: 'Python is simple, powerful, and fun. Here is why we chose Python as the gateway to real coding for our students.', avatarColor: 'linear-gradient(135deg,#7c3aed,#4c1d95)', authorName: 'Tr. Kaung Thu' },
];
