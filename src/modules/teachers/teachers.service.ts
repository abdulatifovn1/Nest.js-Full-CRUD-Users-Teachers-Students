import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { PrismaService } from '../../core/prisma/prisma.service.js';
import argon from "argon2"

@Injectable()
export class TeachersService {
    constructor(private prismaService: PrismaService){}

    async create(data: CreateTeacherDto) {
        const {email, password, fullname} = data
        const existAdmin = await this.prismaService.user.findUnique({where: {email}})
        const existTeacher = await this.prismaService.teacher.findUnique({where: {email}})
        const existStudent = await this.prismaService.student.findUnique({where: {email}})
        const existUser = existAdmin || existTeacher || existStudent
        if (existUser){
            throw new ConflictException("User already exists with this email")
        }
        const hashPassword = await argon.hash(password)
        return await this.prismaService.teacher.create({
        data: {email,password:hashPassword,fullname}
        })
    }

    async findAll() {
        return await this.prismaService.teacher.findMany({select: {
        id:true,
        email:true,
        fullname:true,
        createdAt:true,
        role:true
        }})
    }

    async findOne(id: number) {
        return await this.prismaService.teacher.findUnique({where: {id},select: {
        id:true,
        email:true,
        fullname:true,
        createdAt:true,
        role:true 
        }})
    }

    async update(id: number, data: UpdateTeacherDto) {
        const teacherFound = await this.prismaService.teacher.findUnique({where: {id}})
        if(!teacherFound){
            throw new NotFoundException(`Teacher with ID ${id} is not found`)
        }

        const updateData: {
            email?: string;
            fullname?: string;
            password?: string;
        } = {};

        if (data.email !== undefined) {
            const {email} = teacherFound
            const existAdmin = await this.prismaService.user.findUnique({where: {email}})
            const existTeacher = await this.prismaService.teacher.findUnique({where: {email}})
            const existStudent = await this.prismaService.student.findUnique({where: {email}})
            const existUser = existAdmin || existTeacher || existStudent
            if (existUser){
                throw new ConflictException("User already exists with this email")
            }
            updateData.email = data.email;
        }
        if (data.fullname !== undefined) {
            updateData.fullname = data.fullname;
        }
        if (data.password !== undefined) {
            updateData.password = await argon.hash(data.password);
        }

        return this.prismaService.teacher.update({where:{id},data: updateData})
    }

    async remove(id: number) {
        const teacherFound = await this.findOne(id)
        if(!teacherFound){
            throw new NotFoundException(`Teacher with ID ${id} is not found`)
        }

        return this.prismaService.teacher.delete({
            where: {id}
        })
    }
}
