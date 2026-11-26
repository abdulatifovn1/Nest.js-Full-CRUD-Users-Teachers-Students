import { BadRequestException, CanActivate, ExecutionContext, Global, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwt: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const tokenBearer = req.headers?.authorization
        if (!tokenBearer){
            throw new UnauthorizedException("No token was provided")
        }
        try {
        const token = tokenBearer.split(' ')[1]
        const payload = await this.jwt.verifyAsync(token,{secret:process.env.JWT_SECRET})

        req.user = payload
        return true

        } catch (error:any) {
            throw new BadRequestException(error.message)
        }
    }
}