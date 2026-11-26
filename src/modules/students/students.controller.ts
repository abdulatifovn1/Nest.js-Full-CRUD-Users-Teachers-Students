import { Controller, Get, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { RolesGuard } from '../../common/guards/role.guard.js';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { Roles } from '../../common/utils/decorators.js';

@Controller('students')
@Roles(['admin'])
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @UseGuards(AuthGuard,RolesGuard)  
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard,RolesGuard)
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard,RolesGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard,RolesGuard)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
