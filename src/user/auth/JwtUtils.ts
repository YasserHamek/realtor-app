import { BadRequestException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class JwtUtils {
  public static createJsonWebToken(userId: number, userName: string): string {
    return jwt.sign(
      {
        id: userId,
        name: userName,
      },
      process.env.JSON_WEB_TOKEN_KEY,
    );
  }

  public static decodeToken(token: string) {
    const returnedToken = token ? jwt.decode(token.replace("Bearer ", "")) : "";
    if (returnedToken) return returnedToken;
    throw new BadRequestException("Unvalid Token, please use a valid one.");
  }
}
