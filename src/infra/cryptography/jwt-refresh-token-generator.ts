import { RefreshTokenGenerator } from "@/domain/marketplace/application/cryptography/refresh-token-generator";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtRefreshTokenGenerator implements RefreshTokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        refreshToken: true,
      },
      {
        expiresIn: "7d", // Refresh token com duração mais longa
      }
    );
  }
}
