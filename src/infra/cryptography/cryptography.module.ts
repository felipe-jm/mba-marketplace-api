import { Module } from "@nestjs/common";

import { Encrypter } from "@/domain/marketplace/application/cryptography/encrypter";
import { HashComparer } from "@/domain/marketplace/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/marketplace/application/cryptography/hash-generator";
import { RefreshTokenGenerator } from "@/domain/marketplace/application/cryptography/refresh-token-generator";
import { TokenVerifier } from "@/domain/marketplace/application/cryptography/token-verifier";

import { BcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";
import { JwtRefreshTokenGenerator } from "./jwt-refresh-token-generator";
import { JwtTokenVerifier } from "./jwt-token-verifier";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: RefreshTokenGenerator,
      useClass: JwtRefreshTokenGenerator,
    },
    {
      provide: TokenVerifier,
      useClass: JwtTokenVerifier,
    },
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
    RefreshTokenGenerator,
    TokenVerifier,
  ],
})
export class CryptographyModule {}
