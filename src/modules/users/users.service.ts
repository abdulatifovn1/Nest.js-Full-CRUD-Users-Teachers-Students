import argon from "argon2"
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../core/prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService : PrismaService){}
    
    async create(data: CreateUserDto) {
        const {email, password, fullname} = data
        const existAdmin = await this.prismaService.user.findUnique({where: {email}})
        const existTeacher = await this.prismaService.teacher.findUnique({where: {email}})
        const existStudent = await this.prismaService.student.findUnique({where: {email}})
        const existUser = existAdmin || existTeacher || existStudent
        if (existUser){
            throw new ConflictException("User already exists with this email")
        }
        const hashPassword = await argon.hash(password)
        return await this.prismaService.user.create({
        data: {email,password:hashPassword,fullname}
        })
    }

  async findAll() {
    return await this.prismaService.user.findMany({select: {
      id:true,
      email:true,
      fullname:true,
      createdAt:true,
      role:true
    }})
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({where: {id},select: {
      id:true,
      email:true,
      fullname:true,
      createdAt:true,
      role:true 
    }})
  }

    async update(id: number, data: UpdateUserDto) {
        const userFound = await this.prismaService.user.findUnique({where: {id}})
        if(!userFound){
        throw new NotFoundException(`User with ID ${id} is not found`)
        }

        const updateData: {
            email?: string;
            fullname?: string;
            password?: string;
        } = {};

        if (data.email !== undefined) {
            const {email} = userFound
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

        return this.prismaService.user.update({where:{id},data: updateData})
    }

  async remove(id: number) {
    const userFound = await this.findOne(id)
    if(!userFound){
      throw new NotFoundException(`User with ID ${id} is not found`)
    }

    return this.prismaService.user.delete({
        where: {id}
    })
  }
}
