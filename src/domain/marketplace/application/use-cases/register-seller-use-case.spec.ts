import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { RegisterSellerUseCase } from "./register-seller-use-case";
import { makeSeller } from "test/factories/make-seller";
import { SellerAlreadyExistsError } from "./errors/seller-already-exists-error";
import { PasswordDoesNotMatchError } from "./errors/password-does-not-match-error";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let fakeHasher: FakeHasher;
let sut: RegisterSellerUseCase;

describe("Register Seller", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryAttachmentsRepository
    );
    fakeHasher = new FakeHasher();
    sut = new RegisterSellerUseCase(inMemorySellersRepository, fakeHasher);
  });

  it("should be able to register a new seller", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "123456",
      passwordConfirmation: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      seller: inMemorySellersRepository.items[0],
    });
  });

  it("should register a seller with a hashed password", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "123456",
      passwordConfirmation: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemorySellersRepository.items[0].password).toEqual(hashedPassword);
  });

  it("should not be able to register a seller with the same e-mail.", async () => {
    const seller = makeSeller();

    inMemorySellersRepository.items.push(seller);

    const result = await sut.execute({
      name: "New John Doe",
      email: seller.email,
      phone: "1234567890",
      password: "123456",
      passwordConfirmation: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SellerAlreadyExistsError);
  });

  it("should not be able to register a seller with the same phone.", async () => {
    const seller = makeSeller();

    inMemorySellersRepository.items.push(seller);

    const result = await sut.execute({
      name: "New John Doe",
      email: "johndoe@example.com",
      phone: seller.phone,
      password: "123456",
      passwordConfirmation: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SellerAlreadyExistsError);
  });

  it("should not be able to register a seller with a different password and password confirmation", async () => {
    const result = await sut.execute({
      name: "New John Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "123456",
      passwordConfirmation: "1234567",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PasswordDoesNotMatchError);
  });
});
