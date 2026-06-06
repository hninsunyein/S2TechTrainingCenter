import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { toAssetUrl } from '../shared/multer.config';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 6,
    );
  }

  @Get(':slug') findOne(@Param('slug') slug: string) { return this.blogService.findOne(slug); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const imageUrl = file ? toAssetUrl(file.filename) : undefined;
    return this.blogService.create(body, imageUrl);
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
    return this.blogService.update(id, body, imageUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: string) { return this.blogService.remove(id); }
}
