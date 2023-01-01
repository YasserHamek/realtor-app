import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaModule } from "../src/prisma/prisma.module";
import { UserModule } from "../src/user/user.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it("/ (GET)", () => {
    //prismaService.cleanDatabase();
    //return request(app.getHttpServer()).get("/").expect(200).expect("Hello Nest!");
  });
});
