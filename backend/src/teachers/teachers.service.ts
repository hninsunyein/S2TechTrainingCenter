import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function parseField(val: unknown): unknown {
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.teacher.findMany({ orderBy: { createdAt: 'asc' } }); }

  async findOne(slug: string) {
    const t = await this.prisma.teacher.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!t) throw new NotFoundException('Teacher not found');
    return t;
  }

  create(data: any, imageUrl?: string) {
    const { subjects, tags, ...rest } = data;
    return this.prisma.teacher.create({
      data: {
        ...rest,
        subjects: parseField(subjects),
        tags: parseField(tags) as string[],
        imageUrl: imageUrl ?? null,
      },
    });
  }

  async update(id: string, data: any, imageUrl?: string) {
    await this.findOne(id);
    const { subjects, tags, ...rest } = data;
    const updateData: any = { ...rest };
    if (subjects !== undefined) updateData.subjects = parseField(subjects);
    if (tags !== undefined) updateData.tags = parseField(tags) as string[];
    if (imageUrl) updateData.imageUrl = imageUrl;
    return this.prisma.teacher.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.teacher.delete({ where: { id } });
  }
}
