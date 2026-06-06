import {
  Body, Controller, Delete, Get, Param, Patch, Post,
  UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { TeachersService } from './teachers.service';
import { toAssetUrl } from '../shared/multer.config';

@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Get() findAll() { return this.teachersService.findAll(); }
  @Get(':slug') findOne(@Param('slug') slug: string) { return this.teachersService.findOne(slug); }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    const imageUrl = file ? toAssetUrl(file.filename) : undefined;
    return this.teachersService.create(body, imageUrl);
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
    return this.teachersService.update(id, body, imageUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: string) { return this.teachersService.remove(id); }
}
