import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@s2tech.com' },
    update: {},
    create: { email: 'admin@s2tech.com', password: hash, name: 'S2 Tech Admin' },
  });

  // Teachers
  const hs = await prisma.teacher.upsert({
    where: { slug: 'hs' },
    update: {},
    create: {
      slug: 'hs', initials: 'HS', name: 'Tr. Hnin Su', role: 'Lead Instructor',
      color: 'linear-gradient(135deg,#0ea5c8,#0c4a6e)', cover: 'linear-gradient(135deg,#0c2030,#082840)',
      bio: 'Founder of S2 Tech. Leads EVC and Coding classes with 3+ years of experience teaching children through creative, hands-on methods.',
      subjects: [{ icon: '🔤', name: 'EVC — English Vocabulary' }, { icon: '🐱', name: 'Scratch Level 1 and 2' }, { icon: '🐍', name: 'Python Basic' }],
      tags: ['Online & Offline', 'Ages 5–14'], students: '50+', years: '3+', rating: '5.0',
    },
  });
  const kt = await prisma.teacher.upsert({
    where: { slug: 'kt' },
    update: { name: 'Tr. Kyal Sin', initials: 'KS' },
    create: {
      slug: 'kt', initials: 'KS', name: 'Tr. Kyal Sin', role: 'Coding Instructor',
      color: 'linear-gradient(135deg,#7c3aed,#4c1d95)', cover: 'linear-gradient(135deg,#1a0a30,#22103a)',
      bio: 'Teaches Scratch Level 1 and 2 and Python Basic. Specializes in hands-on project building and interactive game design for kids.',
      subjects: [{ icon: '🐱', name: 'Scratch Level 1' }, { icon: '🎮', name: 'Scratch Level 2' }, { icon: '🐍', name: 'Python Basic' }],
      tags: ['Online & Offline', 'Ages 9–14'], students: '30+', years: '2+', rating: '4.9',
    },
  });
  await prisma.teacher.upsert({
    where: { slug: 'tm' },
    update: { name: 'Tr. Zaw', initials: 'Z' },
    create: {
      slug: 'tm', initials: 'Z', name: 'Tr. Zaw', role: 'English Vocabulary Instructor',
      color: 'linear-gradient(135deg,#f59e0b,#b45309)', cover: 'linear-gradient(135deg,#2a1804,#301e06)',
      bio: 'Specializes in EVC — teaching English vocabulary using picture-based and audio methods.',
      subjects: [{ icon: '🔤', name: 'EVC — Elementary Vocabulary' }, { icon: '🔊', name: 'Phonics and Pronunciation' }, { icon: '📖', name: 'Reading and Word Building' }],
      tags: ['Online (Zoom)', 'Ages 5–12'], students: '25+', years: '2', rating: '5.0',
    },
  });

  // Courses
  const courseData = [
    {
      slug: 'scratch1', emoji: '🐱', category: 'Coding · Scratch', name: 'Scratch Level 1',
      tagline: 'Visual block programming for beginners', teacherId: hs.id,
      description: 'Start your coding journey with Scratch! Learn sprites, motion, loops, and events using colorful visual blocks.',
      color: '#0ea5c8', shadow: 'rgba(14,165,200,.18)', thumb: 'linear-gradient(135deg,#0c1e30,#0a2a3a)',
      badge: 'Level 1', badgeColor: 'rgba(14,165,200,.2)', badgeText: '#7dd3fc',
      tags: ['Age 7+', '12 Lessons', '3 Months', 'Online + Offline'],
      price: '35,000 Ks / month', priceShort: '35,000 Ks',
      stats: [{ n: '12', l: 'Lessons' }, { n: '3', l: 'Months' }, { n: '7+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
      aboutPoints: ['Understand how Scratch sprites, stage, and backdrops work', 'Use motion, looks, and sound blocks to animate characters', 'Build simple games using loops and conditionals', 'Create interactive stories and animations', 'Complete a final mini-game project from scratch'],
      lessons: [
        { title: 'Welcome to Scratch — What is a Sprite?', duration: '8:22', isFree: true, order: 1 },
        { title: 'Motion Blocks — Making Things Move', duration: '10:05', isFree: true, order: 2 },
        { title: 'Looks Blocks — Costumes and Size', duration: '9:30', isFree: false, order: 3 },
        { title: 'Sound Blocks — Adding Music', duration: '8:45', isFree: false, order: 4 },
        { title: 'Loop Blocks — Repeat and Forever', duration: '12:40', isFree: false, order: 5 },
        { title: 'Events — When Key Pressed', duration: '11:15', isFree: false, order: 6 },
        { title: 'Conditionals — If Then Logic', duration: '13:20', isFree: false, order: 7 },
        { title: 'Variables — Keeping Score', duration: '14:00', isFree: false, order: 8 },
        { title: 'Pen Tool — Drawing on Stage', duration: '10:50', isFree: false, order: 9 },
        { title: 'Clones — Copying Sprites', duration: '12:10', isFree: false, order: 10 },
        { title: 'Mini Project: Catch the Star Game', duration: '20:00', isFree: false, order: 11 },
        { title: 'Final Project Showcase', duration: '15:30', isFree: false, order: 12 },
      ],
    },
    {
      slug: 'scratch2', emoji: '🎮', category: 'Coding · Scratch', name: 'Scratch Level 2',
      tagline: 'Advanced game design and logic', teacherId: kt.id,
      description: 'Take your Scratch skills further! Design complex games with variables, conditionals, and clones.',
      color: '#22c55e', shadow: 'rgba(34,197,94,.18)', thumb: 'linear-gradient(135deg,#0d2018,#0a2a16)',
      badge: 'Level 2', badgeColor: 'rgba(34,197,94,.2)', badgeText: '#86efac',
      tags: ['Age 9+', '15 Lessons', '4 Months', 'Online + Offline'],
      price: '35,000 Ks / month', priceShort: '35,000 Ks',
      stats: [{ n: '15', l: 'Lessons' }, { n: '4', l: 'Months' }, { n: '9+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
      aboutPoints: ['Master variables and lists for complex data handling', 'Build scoring systems and game states', 'Use broadcast messages between sprites', 'Design multi-level games with increasing difficulty', 'Learn debugging techniques'],
      lessons: [
        { title: 'Level 2 Overview — What is New?', duration: '7:50', isFree: true, order: 1 },
        { title: 'Variables Deep Dive', duration: '13:20', isFree: true, order: 2 },
        { title: 'Conditionals — If Else Logic', duration: '14:45', isFree: false, order: 3 },
        { title: 'Clones — Multiple Objects', duration: '16:00', isFree: false, order: 4 },
        { title: 'Broadcast Messages', duration: '13:30', isFree: false, order: 5 },
      ],
    },
    {
      slug: 'python', emoji: '🐍', category: 'Coding · Python', name: 'Python Basic',
      tagline: 'Real text-based coding from scratch', teacherId: kt.id,
      description: 'Write real Python code from day one! Learn variables, functions, loops, and problem-solving.',
      color: '#a78bfa', shadow: 'rgba(167,139,250,.18)', thumb: 'linear-gradient(135deg,#12102a,#1a1040)',
      badge: 'Basic', badgeColor: 'rgba(167,139,250,.2)', badgeText: '#c4b5fd',
      tags: ['Age 11+', '20 Lessons', '5 Months', 'Online + Offline'],
      price: '40,000 Ks / month', priceShort: '40,000 Ks',
      stats: [{ n: '20', l: 'Lessons' }, { n: '5', l: 'Months' }, { n: '11+', l: 'Min Age' }, { n: 'HD', l: 'Video' }],
      aboutPoints: ['Understand how computers think using Python syntax', 'Work with variables, strings, numbers, and booleans', 'Write functions to organize and reuse code', 'Use for/while loops to automate repetitive tasks', 'Build small programs: calculator, quiz game, text adventure'],
      lessons: [
        { title: 'Intro to Python — What is Code?', duration: '9:15', isFree: true, order: 1 },
        { title: 'Variables — Storing Data', duration: '11:30', isFree: true, order: 2 },
        { title: 'Data Types — Strings and Numbers', duration: '12:00', isFree: false, order: 3 },
        { title: 'Input and Print', duration: '10:55', isFree: false, order: 4 },
        { title: 'If Elif Else — Making Decisions', duration: '14:20', isFree: false, order: 5 },
      ],
    },
    {
      slug: 'evc', emoji: '🔤', category: 'Language · English', name: 'EVC — English Vocabulary',
      tagline: 'Elementary Vocabulary Class for kids', teacherId: hs.id,
      description: 'Build English vocabulary through pictures, audio, flashcards, and quizzes.',
      color: '#f59e0b', shadow: 'rgba(245,158,11,.18)', thumb: 'linear-gradient(135deg,#1e1608,#2a1e08)',
      badge: 'All Ages', badgeColor: 'rgba(245,158,11,.2)', badgeText: '#fcd34d',
      tags: ['Age 5–14', 'Ongoing', 'Online (Zoom)', 'Offline'],
      price: '35,000 Ks / month', priceShort: '35,000 Ks',
      stats: [{ n: '5–14', l: 'Age' }, { n: '2x', l: 'Weekly' }, { n: 'Zoom', l: 'Online' }, { n: 'HD', l: 'Video' }],
      aboutPoints: ['Learn vocabulary through colorful pictures', 'Practice pronunciation with audio', 'Review with flashcard games and quizzes', 'Topics: Animals, Colors, Food, Body Parts, and more', 'Phrasal verbs and everyday expressions'],
      lessons: [
        { title: 'Welcome! Animals Vocabulary', duration: '6:15', isFree: true, order: 1 },
        { title: 'Colors and Shapes', duration: '5:40', isFree: true, order: 2 },
        { title: 'Numbers and Counting', duration: '7:20', isFree: false, order: 3 },
      ],
    },
  ];

  for (const c of courseData) {
    const { lessons, ...courseFields } = c;
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: courseFields,
    });
    for (const l of lessons) {
      await prisma.lesson.upsert({
        where: { id: `${course.id}-${l.order}` },
        update: {},
        create: { ...l, courseId: course.id, id: `${course.id}-${l.order}` },
      });
    }
  }

  // Reviews
  const reviews = [
    { stars: 5, text: 'My son built his own mini game after Scratch Level 1! Teachers are patient and lessons are very engaging.', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: 'AK', authorName: 'Ma Aye Khaing', authorRole: 'Parent · Child age 9' },
    { stars: 5, text: 'The EVC class is excellent — picture-based teaching makes it so easy for my daughter to remember words!', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', initials: 'KK', authorName: 'Ko Kyaw Kyaw', authorRole: 'Parent · Child age 11' },
    { stars: 5, text: 'I am in Python Basic and can make the computer do what I say. S2 Tech makes learning feel like a game!', avatarColor: 'linear-gradient(135deg,#a78bfa,#7c3aed)', initials: 'TH', authorName: 'Thant Htet', authorRole: 'Student · Age 13' },
    { stars: 5, text: 'My 7-year-old drew beautiful pictures in Scratch Paint. Tr. Hnin Su teaches with so much care!', avatarColor: 'linear-gradient(135deg,#f472b6,#db2777)', initials: 'MN', authorName: 'Ma Nilar Win', authorRole: 'Parent · Age 7 · Scratch L1' },
    { stars: 5, text: 'Seeing my son present his PowerPoint about Myanmar was a proud moment. S2 Tech builds real confidence!', avatarColor: 'linear-gradient(135deg,#22c55e,#16a34a)', initials: 'SK', authorName: 'Ko Si Thu Kyaw', authorRole: 'Parent · Grade 8' },
    { stars: 5, text: 'The reward system after passing the Basic Computer test really motivated my son. He practices daily!', avatarColor: 'linear-gradient(135deg,#fb923c,#ea580c)', initials: 'WT', authorName: 'Ma Win Thida', authorRole: 'Parent · Son age 10' },
  ];
  for (const r of reviews) {
    await prisma.review.create({ data: r }).catch(() => {});
  }

  // Blog posts
  const posts = [
    { slug: '5-fun-scratch-projects', thumb: 'linear-gradient(135deg,#0c1e30,#0a2a40)', category: 'Scratch', categoryColor: JSON.stringify({ background: 'rgba(14,165,200,.2)', border: '1px solid rgba(14,165,200,.35)', color: 'var(--teal)' }), date: 'May 10, 2025', readTime: '4 min read', title: '5 Fun Scratch Projects for Beginners', excerpt: 'New to Scratch? Here are 5 easy and creative projects to build confidence and spark curiosity in young coders.', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', authorName: 'Tr. Hnin Su' },
    { slug: 'english-vocab-at-home', thumb: 'linear-gradient(135deg,#1a1408,#2a2010)', category: 'English', categoryColor: JSON.stringify({ background: 'rgba(245,158,11,.2)', border: '1px solid rgba(245,158,11,.35)', color: 'var(--gold)' }), date: 'Apr 28, 2025', readTime: '3 min read', title: 'How to Help Your Child Learn English Vocabulary at Home', excerpt: 'Simple daily habits that parents can use to reinforce English vocabulary outside of class time.', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', authorName: 'Tr. Thida Maung' },
    { slug: 'python-for-kids', thumb: 'linear-gradient(135deg,#12102a,#1a1040)', category: 'Python', categoryColor: JSON.stringify({ background: 'rgba(167,139,250,.2)', border: '1px solid rgba(167,139,250,.35)', color: 'var(--purple)' }), date: 'Apr 15, 2025', readTime: '5 min read', title: 'Why Python is the Best First Programming Language for Kids', excerpt: 'Python is simple, powerful, and fun. Here is why we chose Python as the gateway to real coding.', avatarColor: 'linear-gradient(135deg,#7c3aed,#4c1d95)', authorName: 'Tr. Kaung Thu' },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // Students
  const students = [
    { emoji: '🌳', category: 'paint', bg: 'linear-gradient(135deg,#1a2a14,#0d1a0a)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Apple Tree Drawing', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0284a8)', initials: 'MK', name: 'Ma Khin Myat', className: 'Scratch L1 · Age 8' },
    { emoji: '🐞', category: 'paint', bg: 'linear-gradient(135deg,#2a1020,#180a18)', badge: 'paint-b', badgeLabel: 'Paint', project: 'Ladybug Illustration', avatarColor: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: 'AT', name: 'Aung Thu', className: 'Scratch L1 · Age 7' },
    { emoji: '🐱', category: 'scratch', bg: 'linear-gradient(135deg,#0a1e2a,#081828)', badge: 'scratch-b', badgeLabel: 'Scratch', project: 'Mini Game Project', avatarColor: 'linear-gradient(135deg,#0ea5c8,#0c4a6e)', initials: 'KK', name: 'Kaung Ko', className: 'Scratch L1 · Age 10' },
    { emoji: '🗺️', category: 'ppt', bg: 'linear-gradient(135deg,#1a0a28,#120822)', badge: 'ppt-b', badgeLabel: 'PPT', project: 'Land of Myanmar', avatarColor: 'linear-gradient(135deg,#a78bfa,#6d28d9)', initials: 'KT', name: 'Khit Thazin Maung', className: 'Python · Grade 8' },
  ];
  for (const s of students) {
    await prisma.student.create({ data: s }).catch(() => {});
  }

  console.log('✅ Database seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
