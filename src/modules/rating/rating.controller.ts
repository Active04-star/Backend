import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from '../../dtos/rating/createRating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createRating(createRatingDto);
  }

  @Get(':id')
  async getRatingById(@Param('id') id: string) {
    return this.ratingService.getRatingById(+id);
  }

  @Get('average/:targetId')
  async getAverageRating(@Param('targetId') targetId: string, @Query('targetType') targetType: string) {
    return this.ratingService.getAverageRating(targetId, targetType);
  }
}
