import { InMememoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { CreateProductUseCase } from "./create-product-use-case";

let inMemoryProductsRepository: InMememoryProductsRepository;
let sut: CreateProductUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMememoryProductsRepository();
    sut = new CreateProductUseCase(inMemoryProductsRepository);
  });

  it("should be able to create a product", async () => {
    const result = await sut.execute({
      title: "New product",
      description: "A beautiful new product",
      priceInCents: 10000,
      ownerId: "1",
      categoryId: "1",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product);
  });
});
