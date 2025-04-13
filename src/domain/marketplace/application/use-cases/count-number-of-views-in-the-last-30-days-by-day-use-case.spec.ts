import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { makeView } from "test/factories/make-view";
import { InMemoryViewsRepository } from "test/repositories/in-memory-views-repository";
import { CountNumberOfViewsInTheLast30DaysByDayUseCase } from "./count-number-of-views-in-the-last-30-days-by-day-use-case";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

describe("Get Number Of Products Views In The Last 30 Days By Day", () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let inMemoryProductsRepository: InMemoryProductsRepository;
  let inMemoryViewsRepository: InMemoryViewsRepository;
  let sut: CountNumberOfViewsInTheLast30DaysByDayUseCase;

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

  it("should be able to get the number of products views in the last 30 days by day", async () => {
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

    const anotherProduct = makeProduct({
      title: "Product 2",
      description: "Product 2 description",
      priceInCents: 1000,
      ownerId: seller.id,
    });

    inMemoryProductsRepository.items.push(product, anotherProduct);

    const todayLess15Days = new Date();
    todayLess15Days.setDate(todayLess15Days.getDate() - 15);

    const todayLess10Days = new Date();
    todayLess10Days.setDate(todayLess10Days.getDate() - 10);

    const view = makeView({
      productId: product.id.toString(),
      userId: seller.id.toString(),
      createdAt: todayLess15Days,
    });

    const anotherView = makeView({
      productId: anotherProduct.id.toString(),
      userId: seller.id.toString(),
      createdAt: todayLess10Days,
    });

    inMemoryViewsRepository.items.push(view, anotherView);

    sut = new CountNumberOfViewsInTheLast30DaysByDayUseCase(
      inMemoryViewsRepository,
      inMemorySellersRepository
    );

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.viewsPerDay.length).toBe(2);
      expect(result.value.viewsPerDay[0].date).toBe(
        todayLess15Days.toISOString().split("T")[0]
      );
      expect(result.value.viewsPerDay[1].date).toBe(
        todayLess10Days.toISOString().split("T")[0]
      );
    }
  });

  it("should not be able to get the number of products views in the last 30 days by day if the seller does not exist", async () => {
    const result = await sut.execute({
      sellerId: "1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
