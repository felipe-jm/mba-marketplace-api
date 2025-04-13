import { TokenVerifier } from "@/domain/marketplace/application/cryptography/token-verifier";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenVerifier implements TokenVerifier {
  constructor(private readonly jwtService: JwtService) {}

  async verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }
}
