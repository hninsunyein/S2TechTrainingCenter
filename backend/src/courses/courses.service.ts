import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function parseField(val: unknown): unknown {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      include: { teacher: true, lessons: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { teacher: true, lessons: { orderBy: { order: 'asc' } } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  create(data: any, imageUrl?: string) {
    const { lessons, tags, aboutPoints, stats, ...rest } = data;
    return this.prisma.course.create({
      data: {
        ...rest,
        tags: parseField(tags) as string[],
        aboutPoints: parseField(aboutPoints) as string[],
        stats: parseField(stats),
        imageUrl: imageUrl ?? rest.imageUrl ?? null,
        lessons: lessons
          ? { create: (parseField(lessons) as any[]).map((l: any, i: number) => ({ ...l, order: i })) }
          : undefined,
      },
      include: { teacher: true, lessons: true },
    });
  }

  async update(id: string, data: any, imageUrl?: string) {
    await this.findOne(id);
    const { lessons, tags, aboutPoints, stats, ...rest } = data;
    const updateData: any = { ...rest };
    if (tags !== undefined) updateData.tags = parseField(tags) as string[];
    if (aboutPoints !== undefined) updateData.aboutPoints = parseField(aboutPoints) as string[];
    if (stats !== undefined) updateData.stats = parseField(stats);
    if (imageUrl) updateData.imageUrl = imageUrl;

    if (lessons !== undefined) {
      const parsed = parseField(lessons) as any[];
      await this.prisma.lesson.deleteMany({ where: { courseId: id } });
      updateData.lessons = { create: parsed.map((l: any, i: number) => ({ ...l, order: i })) };
    }

    return this.prisma.course.update({
      where: { id },
      data: updateData,
      include: { teacher: true, lessons: { orderBy: { order: 'asc' } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.course.delete({ where: { id } });
  }
}
