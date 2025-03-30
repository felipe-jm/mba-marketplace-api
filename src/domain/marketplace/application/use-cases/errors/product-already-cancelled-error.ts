import { UseCaseError } from "@/core/errors/use-case-error";

export class ProductAlreadyCancelledError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Product already cancelled");
  }
}
