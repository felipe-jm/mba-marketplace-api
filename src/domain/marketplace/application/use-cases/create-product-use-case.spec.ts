import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { CreateProductUseCase } from "./create-product-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeCategory } from "test/factories/make-category";
import { Slug } from "@/domain/marketplace/enterprise/entities/value-objects/slug";
import { makeSeller } from "test/factories/make-seller";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemorySellersRepository,
      inMemoryCategoriesRepository
    );
    sut = new CreateProductUseCase(
      inMemoryProductsRepository,
      inMemoryCategoriesRepository,
      inMemorySellersRepository
    );
  });

  it("should be able to create a product", async () => {
    const category = makeCategory(
      {
        title: "Category 1",
        slug: Slug.createFromText("category-1"),
      },
      new UniqueEntityId("category-1")
    );

    await inMemoryCategoriesRepository.create(category);

    const seller = makeSeller(
      {
        name: "Seller 1",
        email: "seller1@example.com",
        password: "123456",
      },
      new UniqueEntityId("seller-1")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      title: "New product",
      description: "A beautiful new product",
      priceInCents: 10000,
      ownerId: seller.id.toString(),
      categoryId: category.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryProductsRepository.items[0]).toEqual(result.value.product);
    }
  });

  it("should not be able to create a product with an invalid category", async () => {
    const result = await sut.execute({
      title: "New product",
      description: "A beautiful new product",
      priceInCents: 10000,
      ownerId: "1",
      categoryId: "invalid-category-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create a product with an invalid owner", async () => {
    const result = await sut.execute({
      title: "New product",
      description: "A beautiful new product",
      priceInCents: 10000,
      ownerId: "invalid-owner-id",
      categoryId: "1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  // it("should not be able to create a product with invalid attachments", async () => {
  //   const result = await sut.execute({
  //     title: "New product",
  //     description: "A beautiful new product",
  //     priceInCents: 10000,
  //     ownerId: "1",
  //     categoryId: "1",
  //     attachments: ["invalid-attachment-id"],
  //   });

  //   expect(result.isLeft()).toBe(true);
  //   expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  // });
});
