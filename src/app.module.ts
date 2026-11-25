import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { UsersModule } from './modules/users/users.module.js';
import { TeachersModule } from './modules/teachers/teachers.module.js';
import { StudentsModule } from './modules/students/students.module.js';
import { PrismaModule } from './core/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';




export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [  
  UsersModule,
  TeachersModule,
  StudentsModule,
  PrismaModule,
  AuthModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
