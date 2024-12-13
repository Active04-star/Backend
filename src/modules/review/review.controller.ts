import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { reviewCreate } from 'src/dtos/review/review-create.dto';
import { reviewResponse } from 'src/dtos/review/review-response.dto';
import { reviewUpdate } from 'src/dtos/review/review-update.dto';
import { Review } from 'src/entities/review.entity';
import { ReviewService } from './review.service';

// endpoint para ordenar reseñas por puntuacion
// endpoint para contar la cantidad de reseñas

// ordenar los complejos por mayor puntuación
// realizar un conteno de cantidad de opiniones que tiene un centro
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

    @Get()      
    @ApiOperation({ summary: 'Obtiene lista de reseñas' })
    async getReviews(){
        return this.reviewService.getReviews();
    }

    @Get(':id') 
    @ApiOperation({ summary: 'Obtiene reseña por id' })
    async getReviewsById(@Param('id', ParseUUIDPipe) id: string){
        return this.reviewService.getReviewById(id)
    }

    @Get('sportcenter/:id')
    @ApiOperation({ summary: 'Obtiene lista de reseñas por complejo' })
    async getReviewsBySportcenter(@Param('id', ParseUUIDPipe) id:string){
        return this.reviewService.getReviewBySportcenter(id)
    }

    @Post('create')
    @ApiOperation({
        summary: 'Registra una nueva Reseña',
        description: 'Crea una nueva reseña en el sistema',
      })
      @ApiBody({
        description: 'Datos para la creacion de la reseña',
        type: reviewCreate,
      })
      async createReview(
        @Body() data: reviewCreate,
      ): Promise<Review> {
        return await this.reviewService.createReview(data);
      }

      @Put('update/:id')        //actualiza reseña por id
      @ApiOperation({
        summary: 'actualiza una reseña',
        description: 'Actualiza una reseña por Id',
      })
      @ApiParam({
        name: 'id',
        description: 'ID de la reseña a actualizar',
        example: 'a3e3b2d0-4321-7856-0191-adecef103556',
      })
      @ApiBody({
        description: 'Datos necesarios para actualizar la reseña',
        type: reviewUpdate,
      })
      async updateReview(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() data: reviewUpdate,
      ) {
        return await this.reviewService.updateReview(id, data);
      }

      @Delete(':id')
      @ApiOperation({
        summary: 'Elimina una reseña',
        description:
          'Elimina una reseña por id',
      })
      @ApiParam({
        name: 'id',
        description: 'ID de la reseña a eliminar',
        example: 'e3d5c8f0-1234-5678-9101-abcdef123456',
      })
      @ApiBody({
        description:
          'Email del usuario relacionado con la eliminación de la reseña',
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
            },
          },
        },
      })
      async deleteReview(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('email') email: string,
      ) {
        return await this.reviewService.deleteReview(id, email);
      }
    }
