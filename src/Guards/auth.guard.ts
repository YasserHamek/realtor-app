import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/user/auth/auth.service";
import { JwtUtils } from "src/user/auth/JwtUtils";
import { UserTokenData } from "src/user/user.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const token = context?.switchToHttp()?.getRequest()?.headers?.authorization;
    const user: UserTokenData = JwtUtils.verifyToken(token);
    const userDb = await this.authService.getUserById(user.id);

    if (user.id != userDb.id || user.name != userDb.name) {
      throw new UnauthorizedException("User not authenticated.");
    }

    return true;
  }
}
