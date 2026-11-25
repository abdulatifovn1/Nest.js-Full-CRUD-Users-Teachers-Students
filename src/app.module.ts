import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { UsersModule } from './modules/users/users.module.js';
import { TeachersModule } from './modules/teachers/teachers.module.js';
import { StudentsModule } from './modules/students/students.module.js';
import { PrismaModule } from './core/prisma/prisma.module.js';


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
