import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { CountNumberOfProductsSoldInTheLast30DaysUseCase } from "./count-number-of-products-sold-in-the-last-30-days-use-case";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { ProductStatus } from "../../enterprise/entities/product";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

describe("Get Number Of Products Sold In The Last 30 Days", () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let sut: CountNumberOfProductsSoldInTheLast30DaysUseCase;

  beforeAll(() => {
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
  });

  it("should be able to get the number of products sold in the last 30 days", async () => {
    const seller = makeSeller({
      name: "John Doe",
    });

    inMemorySellersRepository.items.push(seller);

    const product = makeProduct({
      title: "Product 1",
      description: "Product 1 description",
      priceInCents: 1000,
      ownerId: seller.id,
      status: ProductStatus.SOLD,
    });

    const product2 = makeProduct({
      title: "Product 2",
      description: "Product 2 description",
      priceInCents: 1000,
      ownerId: seller.id,
      status: ProductStatus.SOLD,
    });

    inMemoryProductsRepository.items.push(product, product2);

    sut = new CountNumberOfProductsSoldInTheLast30DaysUseCase(
      inMemoryProductsRepository,
      inMemorySellersRepository
    );

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.amount).toBe(2);
    }
  });

  it("should not be able to get the number of products sold in the last 30 days if the seller does not exist", async () => {
    const result = await sut.execute({
      sellerId: "1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
