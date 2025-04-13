import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@/infra/database/database.module";
import { SellerFactory } from "test/factories/make-seller";

describe("Get seller profile controller (E2E)", () => {
  let app: INestApplication;
  let sellerFactory: SellerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    sellerFactory = moduleRef.get(SellerFactory);

    await app.init();
  });

  test("[GET] /sellers/:id", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/sellers/${user.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: user.id.toString(),
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      avatarUrl: null,
    });
  });
});
