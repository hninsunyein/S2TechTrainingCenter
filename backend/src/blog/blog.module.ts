import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../shared/multer.config';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
