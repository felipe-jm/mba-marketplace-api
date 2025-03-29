import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { EditProductUseCase } from "@/domain/marketplace/application/use-cases/edit-product-use-case";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

const editProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  categoryId: z.string(),
});

type EditProductBodySchema = z.infer<typeof editProductBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editProductBodySchema);

@Controller("/products/:id")
export class EditProductController {
  constructor(private readonly editProduct: EditProductUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditProductBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") id: string
  ) {
    const { title, description, priceInCents, categoryId } = body;

    const result = await this.editProduct.execute({
      productId: id,
      title,
      description,
      priceInCents,
      categoryId,
      ownerId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === ResourceNotFoundError) {
        throw new NotFoundException(error.message);
      } else if (error.constructor === NotAllowedError) {
        throw new BadRequestException();
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
