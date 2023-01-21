import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../user/service/user.service";
import { JwtUtils } from "../helper/JwtUtils";
import { UserTokenData } from "../../user/controller/user.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserTokenData = JwtUtils.verifyToken(request.headers?.authorization);
    const userDb = await this.authService.getUserById(user.id);

    if (user.id != userDb.id || user.name != userDb.name) {
      throw new UnauthorizedException("User not authenticated.");
    }

    request.user = {
      id: userDb.id,
      name: userDb.name,
      phoneNumber: userDb.phoneNumber,
      email: userDb.email,
      userType: userDb.userType,
    };

    return true;
  }
}
