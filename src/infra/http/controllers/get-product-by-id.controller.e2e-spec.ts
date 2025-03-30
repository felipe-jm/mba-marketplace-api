import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "@/infra/app.module";
import { JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@/infra/database/database.module";
import { ProductFactory } from "test/factories/make-product";
import { SellerFactory } from "test/factories/make-seller";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import { CategoryFactory } from "test/factories/make-category";
import { Slug } from "@/domain/marketplace/enterprise/entities/value-objects/slug";

describe("Get product by id controller (E2E)", () => {
  let app: INestApplication;
  let sellerFactory: SellerFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    sellerFactory = moduleRef.get(SellerFactory);
    productFactory = moduleRef.get(ProductFactory);
    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  test("[GET] /products/:productId", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory({
      title: "Category 1",
      slug: Slug.createFromText("category-1"),
    });

    const product = await productFactory.makePrismaProduct({
      ownerId: user.id,
      title: "New Product 1",
      description: "New Product 1 Description",
      priceInCents: 1000,
      status: ProductStatus.AVAILABLE,
      categoryId: category.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      product: expect.objectContaining({
        id: product.id.toString(),
        ownerId: user.id.toString(),
        ownerName: "John Doe",
        categoryId: category.id.toString(),
        title: "New Product 1",
        description: "New Product 1 Description",
        priceInCents: 1000,
        status: ProductStatus.AVAILABLE,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
  });
});
