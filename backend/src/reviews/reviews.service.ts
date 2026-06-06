import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.review.findMany({ orderBy: { createdAt: 'asc' } }); }

  create(data: any) { return this.prisma.review.create({ data }); }

  async update(id: string, data: any) {
    const exists = await this.prisma.review.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Review not found');
    return this.prisma.review.update({ where: { id }, data });
  }

  async remove(id: string) {
    const exists = await this.prisma.review.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Review not found');
    return this.prisma.review.delete({ where: { id } });
  }
}
