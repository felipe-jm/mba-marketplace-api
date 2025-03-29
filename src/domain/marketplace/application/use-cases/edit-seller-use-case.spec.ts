import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { EditSellerUseCase } from "./edit-seller-use-case";
import { makeSeller } from "test/factories/make-seller";
import { SellerAlreadyExistsError } from "./errors/seller-already-exists-error";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { SellerNotFoundError } from "./errors/seller-not-found-error";
import { PasswordDoesNotMatchError } from "./errors/password-does-not-match-error";

let inMemorySellersRepository: InMemorySellersRepository;
let fakeHasher: FakeHasher;
let sut: EditSellerUseCase;

describe("Edit Seller", () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    fakeHasher = new FakeHasher();
    sut = new EditSellerUseCase(inMemorySellersRepository, fakeHasher);
  });

  it("should be able to edit a seller", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
      new UniqueEntityId("seller-1")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: "John Doe Edited",
      email: "johndoeedited@example.com",
      phone: "1234567891",
      password: "1234567",
      passwordConfirmation: "1234567",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      seller: expect.objectContaining({
        id: seller.id,
        name: "John Doe Edited",
        email: "johndoeedited@example.com",
        phone: "1234567891",
        password: "1234567-hashed",
      }),
    });
  });

  it("should not be able to edit a seller that does not exist.", async () => {
    const result = await sut.execute({
      sellerId: "seller-2",
      name: "John Doe Edited",
      email: "johndoeedited@example.com",
      phone: "1234567891",
      password: "1234567",
      passwordConfirmation: "1234567",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SellerNotFoundError);
  });

  it("should not be able to edit a seller with a already existing e-mail.", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
      new UniqueEntityId("seller-2")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: "John Doe Edited",
      email: "johndoe@example.com",
      phone: "1234567891",
      password: "1234567",
      passwordConfirmation: "1234567",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SellerAlreadyExistsError);
  });

  it("should not be able to edit a seller with a already existing phone.", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
        passwordConfirmation: "123456",
      },
      new UniqueEntityId("seller-3")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: "John Doe Edited",
      email: "johndoeedited@example.com",
      phone: "1234567890",
      password: "1234567",
      passwordConfirmation: "1234567",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SellerAlreadyExistsError);
  });

  it("should not be able to edit a seller with a different password and password confirmation", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
      new UniqueEntityId("seller-4")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      name: "John Doe Edited",
      email: "johndoeedited@example.com",
      phone: "1234567891",
      password: "1234567",
      passwordConfirmation: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PasswordDoesNotMatchError);
  });
});
