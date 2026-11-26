import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Roles } from "../utils/decorators.js";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const allowedRoles = this.reflector.getAllAndOverride(Roles, [
            context.getHandler(),
            context.getClass()
        ])    
        if (!allowedRoles.length){
            return true
        }

        const req = context.switchToHttp().getRequest()
        const user = req.user
        const role = user?.role
        if (!allowedRoles.includes(role)){
            throw new ForbiddenException('No Permission')
        }    
        return true
    }
}