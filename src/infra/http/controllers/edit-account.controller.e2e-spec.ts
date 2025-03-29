import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Edit account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /sellers/me", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .put("/sellers/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe Edited",
        email: "johndoeedited@example.com",
        phone: "1234567891",
        password: "1234567",
        passwordConfirmation: "1234567",
      });

    expect(response.statusCode).toBe(201);

    const sellerOnDatabase = await prisma.user.findFirst({
      where: {
        name: "John Doe Edited",
      },
    });
    expect(sellerOnDatabase).toBeTruthy();
  });
});
