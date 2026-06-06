import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, screenshotUrl?: string) {
    return this.prisma.enrollment.create({
      data: { ...data, screenshotUrl },
    });
  }

  findAll() {
    return this.prisma.enrollment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.enrollment.update({ where: { id }, data: { status } });
  }
}
