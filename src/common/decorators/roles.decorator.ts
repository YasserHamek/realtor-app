import { SetMetadata } from "@nestjs/common/decorators/core/set-metadata.decorator";
import { UserType } from "@prisma/client";

export const ROLES = "roles";

export const Roles = (...roles: UserType[]) => {
  return SetMetadata("roles", roles);
};
