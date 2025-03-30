import { ChangeProductStatusUseCase } from "@/domain/marketplace/application/use-cases/change-product-status-use-case";
import { ProductDoesNotBelongToSellerError } from "@/domain/marketplace/application/use-cases/errors/product-does-not-belong-to-seller-error";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Param,
  Patch,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ProductAlreadySoldError } from "@/domain/marketplace/application/use-cases/errors/product-already-sold-error";
import { ProductAlreadyCancelledError } from "@/domain/marketplace/application/use-cases/errors/product-already-cancelled-error";
import { ProductWithSameStatusError } from "@/domain/marketplace/application/use-cases/errors/product-with-same-status-error";

@Controller("/products/:id/:status")
export class ChangeProductStatusController {
  constructor(
    private readonly changeProductStatus: ChangeProductStatusUseCase
  ) {}

  @Patch()
  async handle(
    @Param("id") id: string,
    @Param("status") status: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.changeProductStatus.execute({
      productId: id,
      status: status as ProductStatus,
      sellerId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === ProductDoesNotBelongToSellerError) {
        throw new ForbiddenException();
      } else if (error.constructor === ProductWithSameStatusError) {
        throw new ForbiddenException();
      } else if (error.constructor === ProductAlreadySoldError) {
        throw new ForbiddenException();
      } else if (error.constructor === ProductAlreadyCancelledError) {
        throw new ForbiddenException();
      } else {
        throw new BadRequestException(error.message);
      }
    }

    const { product } = result.value;

    return {
      product,
    };
  }
}
