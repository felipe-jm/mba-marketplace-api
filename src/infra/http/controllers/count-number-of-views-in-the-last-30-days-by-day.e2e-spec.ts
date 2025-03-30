import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { ViewFactory } from "test/factories/make-view";
import request from "supertest";
import { ProductFactory } from "test/factories/make-product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DatabaseModule } from "@/infra/database/database.module";
import { CategoryFactory } from "test/factories/make-category";

describe("Count Number Of Views In The Last 30 Days By Day", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let viewFactory: ViewFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ViewFactory, ProductFactory, CategoryFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    viewFactory = moduleRef.get(ViewFactory);
    productFactory = moduleRef.get(ProductFactory);
    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  test("[GET] /sellers/metrics/views/days/", async () => {
    const seller = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: seller.id });

    const category = await categoryFactory.makePrismaCategory();

    const product = await productFactory.makePrismaProduct({
      ownerId: new UniqueEntityId(seller.id),
      categoryId: category.id,
    });

    await viewFactory.makePrismaView({
      productId: product.id.toString(),
      userId: seller.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/sellers/metrics/views/days`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.viewsPerDay).toHaveLength(1);
  });
});
