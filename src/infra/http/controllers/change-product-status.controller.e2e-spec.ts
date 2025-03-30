import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { SellerFactory } from "test/factories/make-seller";
import { JwtService } from "@nestjs/jwt";
import { ProductFactory } from "test/factories/make-product";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import { DatabaseModule } from "@/infra/database/database.module";
import { CategoryFactory } from "test/factories/make-category";

describe("Change product status (E2E)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let sellerFactory: SellerFactory;
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [SellerFactory, ProductFactory, CategoryFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    sellerFactory = moduleRef.get(SellerFactory);
    productFactory = moduleRef.get(ProductFactory);
    categoryFactory = moduleRef.get(CategoryFactory);

    await app.init();
  });

  test("[PATCH] /products/:id/:status", async () => {
    const user = await sellerFactory.makePrismaSeller();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const category = await categoryFactory.makePrismaCategory();

    const product = await productFactory.makePrismaProduct({
      ownerId: user.id,
      status: ProductStatus.AVAILABLE,
      categoryId: category.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/products/${product.id}/sold`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
  });
});
