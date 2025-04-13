import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { makeView } from "test/factories/make-view";
import { InMemoryViewsRepository } from "test/repositories/in-memory-views-repository";
import { CountNumberOfProductViewsInTheLast7DaysUseCase } from "./count-number-of-product-views-in-the-last-7-days-use-case";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

describe("Get Number Of Product Views In The Last 7 Days", () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryViewsRepository: InMemoryViewsRepository;
  let sut: CountNumberOfProductViewsInTheLast7DaysUseCase;

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
    inMemoryViewsRepository = new InMemoryViewsRepository();
  });

  it("should be able to get the number of product views in the last 7 days", async () => {
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

    sut = new CountNumberOfProductViewsInTheLast7DaysUseCase(
      inMemoryViewsRepository,
      inMemoryProductsRepository
    );

    const result = await sut.execute({
      productId: product.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.amount).toBe(1);
    }
  });

  it("should not be able to get the number of product views in the last 7 days if the product does not exist", async () => {
    const result = await sut.execute({
      productId: "1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
