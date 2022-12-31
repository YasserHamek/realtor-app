import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  @Inject(ConfigService)
  public configService: ConfigService;

  public getHello(): string {
    const databaseName: string = this.configService.get("DATABASE_URL");
    console.log("__ __ _ process.env.NODE_ENV", process.env.NODE_ENV);
    console.log("__ __ _ pcofigService get NODE_ENV", this.configService.get("NODE_ENV"));
    console.log({ databaseName });

    return "Hello Nest!";
  }
}
