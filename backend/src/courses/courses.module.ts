import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../shared/multer.config';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
