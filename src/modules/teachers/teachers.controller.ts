import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { RolesGuard } from '../../common/guards/role.guard.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { Roles } from '../../common/utils/decorators.js';

@Controller('teachers')
@Roles(['admin'])
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}
  
  @Post()
  @UseGuards(AuthGuard,RolesGuard)
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @UseGuards(AuthGuard,RolesGuard)
  async findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard,RolesGuard)  
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard,RolesGuard)  
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard,RolesGuard)  
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.remove(id);
  }
}
