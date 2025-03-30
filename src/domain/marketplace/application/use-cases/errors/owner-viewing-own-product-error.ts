import { UseCaseError } from "@/core/errors/use-case-error";

export class OwnerViewingOwnProductError extends Error implements UseCaseError {
  constructor() {
    super("Owner viewing own product");
  }
}
