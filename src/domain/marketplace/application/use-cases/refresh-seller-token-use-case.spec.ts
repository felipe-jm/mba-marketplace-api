import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeSeller } from "test/factories/make-seller";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { RefreshSellerTokenUseCase } from "./refresh-seller-token-use-case";
import { FakeRefreshTokenGenerator } from "test/cryptography/fake-refresh-token-generator";
import { FakeTokenVerifier } from "test/cryptography/fake-token-verifier";
import { InvalidRefreshTokenError } from "./errors/invalid-refresh-token-error";

let fakeEncrypter: FakeEncrypter;
let fakeHasher: FakeHasher;
let fakeRefreshTokenGenerator: FakeRefreshTokenGenerator;
let fakeTokenVerifier: FakeTokenVerifier;
let sut: RefreshSellerTokenUseCase;

describe("Refresh Seller Token", () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter();
    fakeHasher = new FakeHasher();
    fakeRefreshTokenGenerator = new FakeRefreshTokenGenerator();
    fakeTokenVerifier = new FakeTokenVerifier();
    sut = new RefreshSellerTokenUseCase(
      fakeEncrypter,
      fakeRefreshTokenGenerator,
      fakeTokenVerifier
    );
  });

  it("should be able to refresh a seller token", async () => {
    const seller = makeSeller({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

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
