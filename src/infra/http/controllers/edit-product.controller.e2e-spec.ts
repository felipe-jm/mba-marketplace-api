import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Edit Product (E2E)", () => {
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

  test("[PUT] /products/:id", async () => {
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
        title: "Category 1",
        slug: "category-1",
      },
    });

    const product = await prisma.product.create({
      data: {
        title: "Nestjs Course",
        description: "Nestjs Course Description",
        priceInCents: 1234567890,
        status: ProductStatus.AVAILABLE,
        ownerId: user.id,
        categoryId: category.id,
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/products/${product.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Nestjs Course Edited",
        description: "Nestjs Course Description Edited",
        priceInCents: 1234567891,
        categoryId: category.id,
      });

    expect(response.statusCode).toBe(204);

    const productOnDatabase = await prisma.product.findFirst({
      where: {
        title: "Nestjs Course Edited",
      },
    });
    expect(productOnDatabase).toBeTruthy();
  });
});
