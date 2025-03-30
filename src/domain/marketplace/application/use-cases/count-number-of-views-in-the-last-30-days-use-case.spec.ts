import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { makeView } from "test/factories/make-view";
import { InMemoryViewsRepository } from "test/repositories/in-memory-views-repository";
import { CountNumberOfViewsInTheLast30DaysUseCase } from "./countt-number-of-views-in-the-last-30-days-use-case";

describe("Count Number Of Views In The Last 30 Days", () => {
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryViewsRepository: InMemoryViewsRepository;
  let sut: CountNumberOfViewsInTheLast30DaysUseCase;

  beforeAll(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemorySellersRepository,
      inMemoryCategoriesRepository
    );
    inMemoryViewsRepository = new InMemoryViewsRepository();
  });

  it("should be able to count the number of views in the last 30 days", async () => {
    const seller = makeSeller({
      name: "John Doe",
    });

    inMemorySellersRepository.items.push(seller);

    const product = makeProduct({
      title: "Product 1",
      description: "Product 1 description",
      priceInCents: 1000,
      ownerId: seller.id,
    });

    inMemoryProductsRepository.items.push(product);

    const view = makeView({
      productId: product.id.toString(),
      userId: seller.id.toString(),
    });

    inMemoryViewsRepository.items.push(view);

    sut = new CountNumberOfViewsInTheLast30DaysUseCase(
      inMemoryViewsRepository,
      inMemorySellersRepository
    );

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.amount).toBe(1);
    }
  });

  it("should not be able to count the number of views in the last 30 days if the seller does not exist", async () => {
    const result = await sut.execute({
      sellerId: "1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
