import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { makeSeller } from "test/factories/make-seller";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateSellerUseCase } from "./authenticate-seller-use-case";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { FakeRefreshTokenGenerator } from "test/cryptography/fake-refresh-token-generator";
import { FakeTokenVerifier } from "test/cryptography/fake-token-verifier";

let inMemorySellersRepository: InMemorySellersRepository;
let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let fakeRefreshTokenGenerator: FakeRefreshTokenGenerator;
let fakeTokenVerifier: FakeTokenVerifier;
let sut: AuthenticateSellerUseCase;

describe("Authenticate Seller", () => {
  beforeEach(() => {
    inMemorySellersRepository = new InMemorySellersRepository();
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    fakeRefreshTokenGenerator = new FakeRefreshTokenGenerator();
    fakeTokenVerifier = new FakeTokenVerifier();
    sut = new AuthenticateSellerUseCase(
      inMemorySellersRepository,
      fakeHasher,
      fakeEncrypter,
      fakeRefreshTokenGenerator
    );
  });

  it("should be able to authenticate a seller", async () => {
    const seller = makeSeller({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemorySellersRepository.items.push(seller);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("should not be able to authenticate a seller with wrong e-mail", async () => {
    const seller = makeSeller();

    inMemorySellersRepository.items.push(seller);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("should not be able to authenticate a seller with wrong password.", async () => {
    const seller = makeSeller();

    inMemorySellersRepository.items.push(seller);

    const result = await sut.execute({
      email: seller.email,
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
