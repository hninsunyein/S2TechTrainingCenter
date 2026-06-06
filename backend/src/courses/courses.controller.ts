import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { toAssetUrl } from '../shared/multer.config';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get() findAll() { return this.coursesService.findAll(); }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.coursesService.findOne(slug); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const imageUrl = file ? toAssetUrl(file.filename) : undefined;
    return this.coursesService.create(body, imageUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? toAssetUrl(file.filename) : undefined;
    return this.coursesService.update(id, body, imageUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: string) { return this.coursesService.remove(id); }
}
