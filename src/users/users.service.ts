import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService : PrismaService){}
  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: createUserDto
    })
  }

  async findAll() {
    return await this.prismaService.user.findMany()
  }

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({where: {id}})
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.findOne(id)
    if(!userFound){
      throw new NotFoundException(`User with ID ${id} is not found`)
    }

    return await this.prismaService.user.update({
      where:{id},
      data:updateUserDto
    })
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
