import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 6) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(slug: string) {
    const post = await this.prisma.blogPost.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  create(data: any, imageUrl?: string) {
    return this.prisma.blogPost.create({ data: { ...data, imageUrl: imageUrl ?? null } });
  }

  async update(id: string, data: any, imageUrl?: string) {
    const updateData: any = { ...data };
    if (imageUrl) updateData.imageUrl = imageUrl;
    return this.prisma.blogPost.update({ where: { id }, data: updateData });
  }

  remove(id: string) { return this.prisma.blogPost.delete({ where: { id } }); }
}
