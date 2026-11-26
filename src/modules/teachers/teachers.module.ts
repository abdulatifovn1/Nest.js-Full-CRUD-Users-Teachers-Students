import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service.js';
import { TeachersController } from './teachers.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],  
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
