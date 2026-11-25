import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../../core/prisma/prisma.service.js';
import argon from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma : PrismaService,
        private jwtService: JwtService
    ){}
    async register(data: RegisterDto){
        const {email, password, fullname} = data
        const existAdmin = await this.prisma.user.findUnique({where: {email}})
        const existTeacher = await this.prisma.teacher.findUnique({where: {email}})
        const existStudent = await this.prisma.student.findUnique({where: {email}})
        const existUser = existAdmin || existTeacher || existStudent
        if (existUser){
            throw new ConflictException("User already exists with this email")
        }
        const hashPassword = await argon.hash(password)
        return await this.prisma.student.create({
            data: {email,password:hashPassword,fullname}
        })        
    }

    async login(data: LoginDto){
        const { email, password } = data
        const existAdmin = await this.prisma.user.findUnique({where: {email}})
        const existTeacher = await this.prisma.teacher.findUnique({where: {email}})
        const existStudent = await this.prisma.student.findUnique({where: {email}})
        const existUser = existAdmin || existTeacher || existStudent
        if (!existUser){
            throw new NotFoundException("Email or password is incorrect")
        }

        const digest = existUser.password
        if (!await argon.verify(digest,password)){
            throw new NotFoundException("Email or password is incorrect")
        }
        const {id,fullname,role} = existUser
        const payload = {
            id,
            email,
            fullname,
            role
        }
        const accessToken = await this.jwtService.signAsync(payload,{expiresIn:'3h'})
        const refreshToken = await this.jwtService.signAsync(payload,{expiresIn:'1d'})
        return {
            success: true,
            message: "Sucessfully logged in ✅",
            accessToken,
            refreshToken,
            role
        }
    }
}
