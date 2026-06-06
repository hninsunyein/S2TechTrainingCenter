import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from '../shared/multer.config';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
