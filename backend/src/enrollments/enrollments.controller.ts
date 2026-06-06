import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('screenshot'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const screenshotUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.enrollmentsService.create(body, screenshotUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() { return this.enrollmentsService.findAll(); }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.enrollmentsService.updateStatus(id, body.status);
  }
}
