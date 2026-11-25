import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { PrismaService } from '../../core/prisma/prisma.service.js';
import argon from "argon2"


@Injectable()
export class StudentsService {
    constructor(private prismaService: PrismaService){}
    async findAll() {
        return await this.prismaService.student.findMany({select: {
        id:true,
        email:true,
        fullname:true,
        createdAt:true,
        role:true
        }})
    }

    async findOne(id: number) {
        return await this.prismaService.student.findUnique({where: {id},select: {
        id:true,
        email:true,
        fullname:true,
        createdAt:true,
        role:true 
        }})
    }

    async update(id: number, data: UpdateStudentDto) {
        const studentFound = await this.prismaService.student.findUnique({where: {id}})
        if(!studentFound){
            throw new NotFoundException(`Teacher with ID ${id} is not found`)
        }

        const updateData: {
            email?: string;
            fullname?: string;
            password?: string;
        } = {};

        if (data.email !== undefined) {
            const {email} = studentFound
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

        return this.prismaService.student.update({where:{id},data: updateData})
    }

    async remove(id: number) {
        const StudentFound = await this.findOne(id)
        if(!StudentFound){
            throw new NotFoundException(`Student with ID ${id} is not found`)
        }

        return this.prismaService.student.delete({
            where: {id}
        })
    }
}
