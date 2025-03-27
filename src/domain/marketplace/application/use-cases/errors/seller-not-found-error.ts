import { UseCaseError } from "@/core/errors/use-case-error";

export class SellerNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Seller with identifier ${identifier} not found.`);
  }
}
