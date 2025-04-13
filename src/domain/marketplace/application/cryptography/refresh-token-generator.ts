export abstract class RefreshTokenGenerator {
  abstract generate(payload: Record<string, unknown>): Promise<string>;
}
