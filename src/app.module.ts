import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { UsersModule } from './users/users.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { StudentsModule } from './students/students.module.js';
import { PrismaModule } from './prisma/prisma.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [  
  UsersModule,
  TeachersModule,
  StudentsModule,
  PrismaModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
