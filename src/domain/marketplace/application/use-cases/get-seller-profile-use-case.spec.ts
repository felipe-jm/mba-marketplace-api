import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { GetSellerProfileUseCase } from "./get-seller-profile-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeSeller } from "test/factories/make-seller";
let inMemorySellersRepository: InMemorySellersRepository;
let sut: GetSellerProfileUseCase;

describe("Get Seller Profile", () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    sut = new GetSellerProfileUseCase(inMemorySellersRepository);
  });

  it("should be able to get seller profile", async () => {
    const seller = makeSeller({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      password: "password",
    });

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      seller,
    });
  });

  it("should not be able to get seller profile if seller does not exist", async () => {
    const result = await sut.execute({
      sellerId: "seller-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
