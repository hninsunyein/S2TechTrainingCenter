import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  findAll(category?: string) {
    return this.prisma.student.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'asc' },
    });
  }

  create(data: any, imageUrl?: string) {
    return this.prisma.student.create({
      data: { ...data, imageUrl: imageUrl ?? null },
    });
  }

  async update(id: string, data: any, imageUrl?: string) {
    const exists = await this.prisma.student.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Student work not found');
    const updateData: any = { ...data };
    if (imageUrl) updateData.imageUrl = imageUrl;
    return this.prisma.student.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    const exists = await this.prisma.student.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Student work not found');
    return this.prisma.student.delete({ where: { id } });
  }
}
