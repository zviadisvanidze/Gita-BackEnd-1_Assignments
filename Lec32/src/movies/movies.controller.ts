import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { QueryMovieDto } from './dto/query-movie.dto';
import { imageUploadOptions } from '../common/aws/multer.config';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'List movies with optional filters and pagination' })
  @Get()
  findAll(@Query() query: QueryMovieDto) {
    return this.moviesService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new movie' })
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOperation({ summary: 'Update a movie' })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Delete a movie' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @ApiOperation({ summary: 'Upload images for a movie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10, imageUploadOptions))
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.moviesService.addImages(id, files);
  }

  @ApiOperation({ summary: 'Remove an image from a movie' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'imageId', type: Number })
  @Delete(':id/images/:imageId')
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.moviesService.removeImage(id, imageId);
  }
}
