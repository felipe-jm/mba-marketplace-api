import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Refresh Token (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /sessions/refresh", async () => {
    await request(app.getHttpServer())
      .post("/sellers")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
        passwordConfirmation: "123456",
      })
      .expect(201);

    const sessionResponse = await request(app.getHttpServer())
      .post("/sessions")
      .send({
        email: "johndoe@example.com",
        password: "123456",
      })
      .expect(201);

    const { refresh_token } = sessionResponse.body;

    const response = await request(app.getHttpServer())
      .post("/sessions/refresh")
      .send({
        refreshToken: refresh_token,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
      refresh_token: expect.any(String),
      seller: {
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
      },
    });
  });
});
