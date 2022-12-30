import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { UserTokenData } from "../user.dto";

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
    return returnedToken ? returnedToken : "";
  }

  public static verifyToken(token: string): UserTokenData {
    try {
      const verifiedToken = jwt.verify(token.replace("Bearer ", ""), process.env.JSON_WEB_TOKEN_KEY);
      console.log("___ _ _ _ verifiedToken : ", verifiedToken);
      return new UserTokenData(verifiedToken);
    } catch (exceptions) {
      throw new UnauthorizedException("User not authenticated.");
    }
  }
}
