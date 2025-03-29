import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { FetchProductsUseCase } from "./fetch-products-use-case";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { ProductStatus } from "../../enterprise/entities/product";

describe("Fetch Products Use Case", () => {
  let inMemoryProductRepository: InMemoryProductsRepository;
  let inMemorySellersRepository: InMemorySellersRepository;
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let sut: FetchProductsUseCase;

  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();

    inMemoryProductRepository = new InMemoryProductsRepository(
      inMemorySellersRepository,
      inMemoryCategoriesRepository
    );

    sut = new FetchProductsUseCase(inMemoryProductRepository);
  });

  it("should be able to fetch products", async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryProductRepository.create(makeProduct());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products.length).toBe(2);
  });

  it("should be able to fetch products by description", async () => {
    const product = makeProduct({
      description: "Test Description",
    });

    const product2 = makeProduct({
      description: "Random",
    });

    await inMemoryProductRepository.create(product);
    await inMemoryProductRepository.create(product2);

    const result = await sut.execute({
      page: 1,
      description: "Test Description",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products.length).toBe(1);
  });

  it("should be able to fetch products by status", async () => {
    const availableProduct = makeProduct({
      status: ProductStatus.AVAILABLE,
    });

    const soldProduct = makeProduct({
      status: ProductStatus.SOLD,
    });

    await inMemoryProductRepository.create(availableProduct);
    await inMemoryProductRepository.create(soldProduct);

    const result = await sut.execute({
      page: 1,
      status: ProductStatus.AVAILABLE,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products.length).toBe(1);
    expect(result.value?.products[0].id).toBe(availableProduct.id);
  });

  it("should be able to fetch products by title", async () => {
    const product = makeProduct({
      title: "Test Product",
    });

    const product2 = makeProduct({
      title: "Random",
    });

    await inMemoryProductRepository.create(product);
    await inMemoryProductRepository.create(product2);

    const result = await sut.execute({
      page: 1,
      title: "Test Product",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.products.length).toBe(1);
  });
});
