import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    console.log(" __ _ __ NODE_ENV : ", process.env.NODE_ENV);
    console.log(' __ _ __ this.config.get("DATABASE_URL"): ', this.configService.get("DATABASE_URL"));
    //const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    //return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
