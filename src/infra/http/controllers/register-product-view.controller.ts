import {
  BadRequestException,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { RegisterProductViewUseCase } from "@/domain/marketplace/application/use-cases/register-product-view-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OwnerViewingOwnProductError } from "@/domain/marketplace/application/use-cases/errors/owner-viewing-own-product-error";
import { ProductViewAlreadyExistsError } from "@/domain/marketplace/application/use-cases/errors/product-view-already-exists";

@Controller("/products/:id/views")
export class RegisterProductViewController {
  constructor(
    private readonly registerProductView: RegisterProductViewUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async handle(@Param("id") id: string, @CurrentUser() user: UserPayload) {
    const result = await this.registerProductView.execute({
      productId: id,
      userId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      } else if (error.constructor === OwnerViewingOwnProductError) {
        throw new ForbiddenException();
      } else if (error.constructor === ProductViewAlreadyExistsError) {
        throw new BadRequestException();
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
