import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  @Inject(ConfigService)
  public configService: ConfigService;

  public getHello(): string {
    const databaseName: string = this.configService.get("DATABASE_URL");

    return "Hello Nest!";
  }
}
