import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get() findAll() { return this.reviewsService.findAll(); }

  @UseGuards(AuthGuard('jwt'))
  @Post() create(@Body() body: any) { return this.reviewsService.create(body); }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.reviewsService.update(id, body); }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id') remove(@Param('id') id: string) { return this.reviewsService.remove(id); }
}
