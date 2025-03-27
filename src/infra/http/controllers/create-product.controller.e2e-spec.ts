import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create product (E2E)", () => {
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

  test("[POST] /products", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const category = await prisma.category.create({
      data: {
        title: "New category",
        slug: "new-category",
      },
    });

    const response = await request(app.getHttpServer())
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New product",
        description: "A beautiful product",
        priceInCents: 10000,
        categoryId: category?.id,
        status: "available",
      });

    expect(response.statusCode).toBe(201);

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: "New product",
      },
    });
    expect(productOnDatabase).toBeTruthy();
  });
});
