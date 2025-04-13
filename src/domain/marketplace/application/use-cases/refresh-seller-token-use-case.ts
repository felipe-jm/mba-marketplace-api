import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { RefreshTokenGenerator } from "../cryptography/refresh-token-generator";
import { TokenVerifier } from "../cryptography/token-verifier";
import { InvalidRefreshTokenError } from "./errors/invalid-refresh-token-error";
import { SellersRepository } from "../repositories/sellers-repository";
import { SellerPresenter } from "@/infra/http/presenters/seller-presenter";

interface TokenPayload {
  sub: string;
  refreshToken?: boolean;
  iat?: number;
  exp?: number;
}

interface RefreshSellerTokenUseCaseRequest {
  refreshToken: string;
}

type RefreshSellerTokenUseCaseResponse = Either<
  InvalidRefreshTokenError,
  {
    accessToken: string;
    refreshToken: string;
    seller: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  }
>;

@Injectable()
export class RefreshSellerTokenUseCase {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly tokenVerifier: TokenVerifier,
    private readonly sellersRepository: SellersRepository
  ) {}

  async execute({
    refreshToken,
  }: RefreshSellerTokenUseCaseRequest): Promise<RefreshSellerTokenUseCaseResponse> {
    try {
      const payload = await this.tokenVerifier.verify<TokenPayload>(
        refreshToken
      );

      // Verificar se é um refresh token
      if (!payload.refreshToken) {
        return left(new InvalidRefreshTokenError());
      }

      // Verificar se o token contém um ID de vendedor
      if (!payload.sub) {
        return left(new InvalidRefreshTokenError());
      }

      const sellerId = payload.sub;

      // Buscar dados do vendedor
      const seller = await this.sellersRepository.findById(sellerId);

      if (!seller) {
        return left(new InvalidRefreshTokenError());
      }

      // Token validado, gerar novos tokens
      const tokenPayload = { sub: sellerId };

      const newAccessToken = await this.encrypter.encrypt(tokenPayload);
      const newRefreshToken = await this.refreshTokenGenerator.generate(
        tokenPayload
      );

      return right({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        seller: SellerPresenter.toHTTP(seller),
      });
    } catch (error) {
      // Qualquer erro de verificação do JWT (expiração, assinatura inválida, etc) cairá aqui
      return left(new InvalidRefreshTokenError());
    }
  }
}
