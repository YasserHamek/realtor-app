import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data, context: ExecutionContext) => {
  return context?.switchToHttp()?.getRequest()?.user;
});
