import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeSeller } from "test/factories/make-seller";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { RegisterProductViewUseCase } from "./register-product-view-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OwnerViewingOwnProductError } from "./errors/owner-viewing-own-product-error";
import { InMemoryViewsRepository } from "test/repositories/in-memory-views-repository";
import { ProductViewAlreadyExistsError } from "./errors/product-view-already-exists";

let inMemoryProductsRepository: InMemoryProductsRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
let inMemoryViewsRepository: InMemoryViewsRepository;
let sut: RegisterProductViewUseCase;

describe("Register Product View", () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    inMemoryViewsRepository = new InMemoryViewsRepository();
    inMemoryProductsRepository = new InMemoryProductsRepository(
      inMemorySellersRepository,
      inMemoryCategoriesRepository
    );

    sut = new RegisterProductViewUseCase(
      inMemoryProductsRepository,
      inMemorySellersRepository,
      inMemoryViewsRepository
    );
  });

  it("should be able to register a product view", async () => {
    const seller = makeSeller({
      name: "John Doe",
    });

    inMemorySellersRepository.items.push(seller);

    const viewerSeller = makeSeller({
      name: "Jane Doe",
    });

    inMemorySellersRepository.items.push(viewerSeller);

    const category = makeCategory({
      title: "New Category",
    });

    inMemoryCategoriesRepository.items.push(category);

    const newProduct = makeProduct({
      title: "New Product",
      description: "New Product Description",
      priceInCents: 1000,
      ownerId: seller.id,
      categoryId: category.id,
    });

    await inMemoryProductsRepository.create(newProduct);

    await sut.execute({
      productId: newProduct.id.toString(),
      userId: viewerSeller.id.toString(),
    });

    expect(inMemoryViewsRepository.items.length).toBe(1);
  });

  it("should not be able to register a product view if the product does not exist", async () => {
    const result = await sut.execute({
      productId: "product-id",
      userId: "user-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a product view if the user does not exist", async () => {
    const result = await sut.execute({
      productId: "product-id",
      userId: "user-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to register a product view if the user is the owner of the product", async () => {
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
      ownerId: author.id,
      categoryId: category.id,
    });

    await inMemoryProductsRepository.create(newProduct);

    const result = await sut.execute({
      productId: newProduct.id.toString(),
      userId: author.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OwnerViewingOwnProductError);
  });

  it("should not be able to register a product view if the product view already exists", async () => {
    const seller = makeSeller({
      name: "John Doe",
    });

    inMemorySellersRepository.items.push(seller);

    const viewerSeller = makeSeller({
      name: "Jane Doe",
    });

    inMemorySellersRepository.items.push(viewerSeller);

    const category = makeCategory({
      title: "New Category",
    });

    inMemoryCategoriesRepository.items.push(category);

    const newProduct = makeProduct({
      title: "New Product",
      description: "New Product Description",
      ownerId: seller.id,
      categoryId: category.id,
    });

    await inMemoryProductsRepository.create(newProduct);

    await sut.execute({
      productId: newProduct.id.toString(),
      userId: viewerSeller.id.toString(),
    });

    const result = await sut.execute({
      productId: newProduct.id.toString(),
      userId: viewerSeller.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductViewAlreadyExistsError);
  });
});
