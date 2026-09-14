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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DirectorsService } from './directors.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { QueryDirectorDto } from './dto/query-director.dto';

@ApiTags('directors')
@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @ApiOperation({ summary: 'List directors with optional filters and pagination' })
  @Get()
  findAll(@Query() query: QueryDirectorDto) {
    return this.directorsService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a director by ID' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.directorsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new director' })
  @Post()
  create(@Body() createDirectorDto: CreateDirectorDto) {
    return this.directorsService.create(createDirectorDto);
  }

  @ApiOperation({ summary: 'Update a director' })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    return this.directorsService.update(id, updateDirectorDto);
  }

  @ApiOperation({ summary: 'Delete a director' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.directorsService.remove(id);
  }
}
