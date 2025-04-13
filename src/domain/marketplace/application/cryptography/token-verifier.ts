export abstract class TokenVerifier {
  abstract verify<T extends object>(token: string): Promise<T>;
}
