import { UseCaseError } from "@/core/errors/use-case-error";

export class ProductDoesNotBelongToSellerError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Product does not belong to seller");
  }
}
