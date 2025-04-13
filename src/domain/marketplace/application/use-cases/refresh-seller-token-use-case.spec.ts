import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeSeller } from "test/factories/make-seller";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { RefreshSellerTokenUseCase } from "./refresh-seller-token-use-case";
import { FakeRefreshTokenGenerator } from "test/cryptography/fake-refresh-token-generator";
import { FakeTokenVerifier } from "test/cryptography/fake-token-verifier";
import { InvalidRefreshTokenError } from "./errors/invalid-refresh-token-error";
import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let fakeRefreshTokenGenerator: FakeRefreshTokenGenerator;
let fakeTokenVerifier: FakeTokenVerifier;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let sut: RefreshSellerTokenUseCase;

describe("Refresh Seller Token", () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    fakeRefreshTokenGenerator = new FakeRefreshTokenGenerator();
    fakeTokenVerifier = new FakeTokenVerifier();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryAttachmentsRepository
    );
    sut = new RefreshSellerTokenUseCase(
      fakeEncrypter,
      fakeRefreshTokenGenerator,
      fakeTokenVerifier,
      inMemorySellersRepository
    );
  });

  it("should be able to refresh a seller token", async () => {
    const seller = makeSeller({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemorySellersRepository.items.push(seller);

    const refreshToken = await fakeRefreshTokenGenerator.generate({
      sub: seller.id.toString(),
    });

    const result = await sut.execute({
      refreshToken,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      seller,
    });
  });

  it("should not be able to refresh a seller token with an invalid refresh token", async () => {
    const result = await sut.execute({
      refreshToken: "invalid-token",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidRefreshTokenError);
  });
});
