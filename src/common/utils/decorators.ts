import { Reflector } from "@nestjs/core";

type Role = 'admin' | 'teacher' | 'student'
export const Roles = Reflector.createDecorator<Role[]>()