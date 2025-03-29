import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoryFactory } from "test/factories/make-category";
import { DatabaseModule } from "@/infra/database/database.module";
import { SellerFactory } from "test/factories/make-seller";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { ProductFactory } from "test/factories/make-product";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";

describe("Fetch Products Controller", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let moduleRef: TestingModule;
  let categoryFactory: CategoryFactory;
  let sellerFactory: SellerFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory, SellerFactory, ProductFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    categoryFactory = moduleRef.get(CategoryFactory);
    sellerFactory = moduleRef.get(SellerFactory);
    productFactory = moduleRef.get(ProductFactory);

    await app.init();
  });

  it("should be able to fetch products", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory({
      title: "Category",
    });

    await Promise.all([
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "New Product 1",
      }),
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "New Product 2",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
  });

  it("should be able to fetch products by title", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory({
      title: "Category",
    });

    await Promise.all([
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "NestJS",
      }),
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "React",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ page: 1, title: "NestJS" });

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(1);
  });

  it("should be able to fetch products by description", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory({
      title: "Category",
    });

    await Promise.all([
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "NestJS",
        description:
          "NestJS is a framework for building server-side applications",
      }),
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "React",
        description: "Advanced React",
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ page: 1, description: "NestJS" });

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(1);
  });

  it("should be able to fetch products by status", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory({
      title: "Category",
    });

    await Promise.all([
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "New Product 1",
        status: ProductStatus.CANCELLED,
      }),
      productFactory.makePrismaProduct({
        ownerId: user.id,
        categoryId: category.id,
        title: "New Product 2",
        status: ProductStatus.SOLD,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .query({ page: 1, status: ProductStatus.CANCELLED });

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(1);
  });
});
