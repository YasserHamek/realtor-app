import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserType } from "@prisma/client";
import { ROLES } from "../decorators/roles.decorator";
import { UserDto } from "../user/user.dto";

@Injectable()
export class RolesGuards implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const user: UserDto = context?.switchToHttp()?.getRequest()?.user;
    const roles: UserType[] = this.reflactor.getAllAndOverride<UserType[]>(ROLES, [context.getHandler(), context.getClass()]);

    if (roles && user && roles.includes(user.userType)) return true;

    throw new ForbiddenException("You don't permission to access this ressource.");
  }
}
