import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { EditProductUseCase } from "./edit-product-use-case";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeProduct } from "test/factories/make-product";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import {
  ProductStatus,
  Product,
} from "@/domain/marketplace/enterprise/entities/product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let sut: EditProductUseCase;

describe("Edit Product", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryAttachmentsRepository
    );
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemorySellersRepository,
      inMemoryCategoriesRepository,
      inMemoryAttachmentsRepository
    );
    sut = new EditProductUseCase(
      inMemoryProductsRepository,
      inMemoryCategoriesRepository
    );
  });

  it("should be able to edit a product", async () => {
    const category = makeCategory(
      {
        title: "Category 1",
        slug: Slug.createFromText("category-1"),
      },
      new UniqueEntityId("category-1")
    );

    const product = makeProduct(
      {
        title: "John Doe",
        description: "johndoe@example.com",
        priceInCents: 1234567890,
        categoryId: category.id,
      },
      new UniqueEntityId("product-1")
    );

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      title: "Nestjs Course",
      description: "Nestjs Course Description",
      priceInCents: 1234567891,
      ownerId: product.ownerId.toString(),
      categoryId: category.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      product: expect.objectContaining({
        id: product.id,
      }),
    });

    const productResult = result.value as { product: Product };
    expect(productResult.product.title).toBe("Nestjs Course");
    expect(productResult.product.description).toBe("Nestjs Course Description");
    expect(productResult.product.priceInCents).toBe(1234567891);
    expect(productResult.product.ownerId.toString()).toBe(
      product.ownerId.toString()
    );
    expect(productResult.product.categoryId.toString()).toBe(
      category.id.toString()
    );
  });

  it("should not be able to edit a product that does not exist.", async () => {
    const result = await sut.execute({
      productId: "product-2",
      title: "Nestjs Course",
      description: "Nestjs Course Description",
      priceInCents: 1234567891,
      ownerId: "owner-1",
      categoryId: "category-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit a product that is not owned by the user.", async () => {
    const category = makeCategory(
      {
        title: "Category 1",
        slug: Slug.createFromText("category-1"),
      },
      new UniqueEntityId("category-1")
    );

    const product = makeProduct(
      {
        title: "John Doe",
        description: "johndoe@example.com",
        priceInCents: 1234567890,
        categoryId: category.id,
      },
      new UniqueEntityId("product-1")
    );

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      title: "Nestjs Course",
      description: "Nestjs Course Description",
      priceInCents: 1234567891,
      ownerId: "owner-2",
      categoryId: category.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should not be able to edit a product with an invalid category", async () => {
    const product = makeProduct(
      {
        title: "John Doe",
        description: "johndoe@example.com",
        priceInCents: 1234567890,
      },
      new UniqueEntityId("product-1")
    );

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      title: "Nestjs Course",
      description: "Nestjs Course Description",
      priceInCents: 1234567891,
      ownerId: product.ownerId.toString(),
      categoryId: "invalid-category-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit a product that is already sold.", async () => {
    const product = makeProduct(
      {
        title: "John Doe",
        description: "johndoe@example.com",
        priceInCents: 1234567890,
        status: ProductStatus.SOLD,
      },
      new UniqueEntityId("product-1")
    );

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      title: "Nestjs Course",
      description: "Nestjs Course Description",
      priceInCents: 1234567891,
      ownerId: product.ownerId.toString(),
      categoryId: product.categoryId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
