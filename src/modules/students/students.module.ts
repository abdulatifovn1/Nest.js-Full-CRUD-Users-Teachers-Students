import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],  
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
