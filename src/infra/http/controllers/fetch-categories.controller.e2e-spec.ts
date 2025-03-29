import { Slug } from "@/domain/marketplace/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoryFactory } from "test/factories/make-category";
import { DatabaseModule } from "@/infra/database/database.module";
import { SellerFactory } from "test/factories/make-seller";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";

describe("Fetch Categories Controller", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let moduleRef: TestingModule;
  let categoryFactory: CategoryFactory;
  let sellerFactory: SellerFactory;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory, SellerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    categoryFactory = moduleRef.get(CategoryFactory);
    sellerFactory = moduleRef.get(SellerFactory);

    await app.init();
  });

  it("should be able to fetch categories", async () => {
    const user = await sellerFactory.makePrismaSeller({
      name: "John Doe",
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const category1 = await categoryFactory.makePrismaCategory({
      title: "Category 1",
      slug: Slug.createFromText("category-1"),
    });

    const category2 = await categoryFactory.makePrismaCategory({
      title: "Category 2",
      slug: Slug.createFromText("category-2"),
    });

    const category3 = await categoryFactory.makePrismaCategory({
      title: "Category 3",
      slug: Slug.createFromText("category-3"),
    });

    const response = await request(app.getHttpServer())
      .get(`/categories`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.categories).toEqual([
      expect.objectContaining({
        id: category1.id.toString(),
        title: category1.title,
        slug: category1.slug.value,
      }),
      expect.objectContaining({
        id: category2.id.toString(),
        title: category2.title,
        slug: category2.slug.value,
      }),
      expect.objectContaining({
        id: category3.id.toString(),
        title: category3.title,
        slug: category3.slug.value,
      }),
    ]);
  });
});
