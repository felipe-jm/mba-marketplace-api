import { GetProductByIdUseCase } from "./get-product-by-id";

import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let sut: GetProductByIdUseCase;

describe("Get Product By Id", () => {
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

    sut = new GetProductByIdUseCase(inMemoryProductsRepository);
  });

  it("should be able to get a product by id", async () => {
    const author = makeSeller({
      name: "John Doe",
    });

    inMemorySellersRepository.items.push(author);

    const category = makeCategory({
      title: "New Category",
    });

    inMemoryCategoriesRepository.items.push(category);

    const newProduct = makeProduct({
      title: "New Product",
      description: "New Product Description",
      priceInCents: 1000,
      ownerId: author.id,
      categoryId: category.id,
    });

    await inMemoryProductsRepository.create(newProduct);

    const result = await sut.execute({
      productId: newProduct.id.toString(),
    });

    if (result.isRight()) {
      expect(result.value).toMatchObject({
        product: expect.objectContaining({
          title: newProduct.title,
          ownerId: author.id,
          ownerName: author.name,
          categoryId: category.id,
          categoryTitle: category.title,
          description: newProduct.description,
          priceInCents: newProduct.priceInCents,
          status: newProduct.status,
          createdAt: newProduct.createdAt,
          updatedAt: newProduct.updatedAt,
        }),
      });
    }
  });
});
