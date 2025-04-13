import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { ChangeProductStatusUseCase } from "./change-product-status-use-case";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ProductStatus } from "../../enterprise/entities/product";
import { makeProduct } from "test/factories/make-product";
import { ProductDoesNotBelongToSellerError } from "./errors/product-does-not-belong-to-seller-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ProductWithSameStatusError } from "./errors/product-with-same-status-error";
import { ProductAlreadySoldError } from "./errors/product-already-sold-error";
import { ProductAlreadyCancelledError } from "./errors/product-already-cancelled-error";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

describe("Change Product Status Use Case", () => {
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let sut: ChangeProductStatusUseCase;

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

    sut = new ChangeProductStatusUseCase(inMemoryProductsRepository);
  });

  it("should be able to change product status", async () => {
    const product = makeProduct({
      status: ProductStatus.AVAILABLE,
    });

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      status: ProductStatus.SOLD,
      sellerId: product.ownerId.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value?.product.status).toBe(ProductStatus.SOLD);
    }
  });

  it("should not be able to change product status if product does not belong to seller", async () => {
    const product = makeProduct({
      status: ProductStatus.AVAILABLE,
    });

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      status: ProductStatus.SOLD,
      sellerId: "seller-id",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProductDoesNotBelongToSellerError);
    }
  });

  it("should not be able to change product status if product has same status", async () => {
    const product = makeProduct({
      status: ProductStatus.AVAILABLE,
    });

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      status: ProductStatus.AVAILABLE,
      sellerId: product.ownerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProductWithSameStatusError);
    }
  });

  it("should not be able to change product status if product does not exist", async () => {
    const result = await sut.execute({
      productId: "product-id",
      status: ProductStatus.SOLD,
      sellerId: "seller-id",
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    }
  });

  it("should not be able to change product status to sold if product is cancelled", async () => {
    const product = makeProduct({
      status: ProductStatus.CANCELLED,
    });

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      status: ProductStatus.SOLD,
      sellerId: product.ownerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProductAlreadyCancelledError);
    }
  });

  it("should not be able to change product status to cancelled if product is already sold", async () => {
    const product = makeProduct({
      status: ProductStatus.SOLD,
    });

    await inMemoryProductsRepository.create(product);

    const result = await sut.execute({
      productId: product.id.toString(),
      status: ProductStatus.CANCELLED,
      sellerId: product.ownerId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ProductAlreadySoldError);
    }
  });
});
