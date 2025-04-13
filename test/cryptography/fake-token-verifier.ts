import { TokenVerifier } from "@/domain/marketplace/application/cryptography/token-verifier";

export class FakeTokenVerifier implements TokenVerifier {
  async verify<T extends object>(token: string): Promise<T> {
    return JSON.parse(token) as T;
  }
}
