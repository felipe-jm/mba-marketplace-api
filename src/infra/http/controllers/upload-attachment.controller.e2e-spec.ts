import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@/infra/database/database.module";
import { SellerFactory } from "test/factories/make-seller";

describe("Upload attachment (E2E)", () => {
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

  test("[POST] /attachments", async () => {
    const user = await sellerFactory.makePrismaSeller();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "test/e2e/sample-upload.jpg");

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
