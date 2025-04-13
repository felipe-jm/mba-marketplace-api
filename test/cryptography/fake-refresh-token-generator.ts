import { RefreshTokenGenerator } from "@/domain/marketplace/application/cryptography/refresh-token-generator";

export class FakeRefreshTokenGenerator implements RefreshTokenGenerator {
  async generate(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify({
      ...payload,
      refreshToken: true,
    });
  }
}
