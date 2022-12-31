import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === "test")
      console.log(
        " __ _ __ is test env, process.env.DATABASE_URL",
        process.env.DATABASE_URL,
        "process.env.test.DATABASE_URL",
        process.env.DATABASE_URL,
      );
    //const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    //return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
