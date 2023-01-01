import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtUtils } from "../../user/auth/JwtUtils";

export class tokenIterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context?.switchToHttp()?.getRequest();
    const token = request?.headers?.authorization;
    const user = JwtUtils.decodeToken(token);

    request.user = user;

    return next.handle();
  }
}