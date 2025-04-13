import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { UpdateSellerAvatarUseCase } from "@/domain/marketplace/application/use-cases/update-seller-avatar-use-case";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SellerNotFoundError } from "@/domain/marketplace/application/use-cases/errors/seller-not-found-error";

const updateSellerAvatarBodySchema = z.object({
  avatarId: z.string().uuid(),
});

type UpdateSellerAvatarBodySchema = z.infer<
  typeof updateSellerAvatarBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(updateSellerAvatarBodySchema);

@Controller("/me/avatar")
export class UpdateSellerAvatarController {
  constructor(private readonly updateSellerAvatar: UpdateSellerAvatarUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: UpdateSellerAvatarBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { avatarId } = body;

    const result = await this.updateSellerAvatar.execute({
      sellerId: user.sub,
      avatarId,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error instanceof SellerNotFoundError) {
        throw new NotFoundException("Seller not found");
      }

      if (error instanceof ResourceNotFoundError) {
        throw new NotFoundException("Attachment not found");
      }

      throw new BadRequestException();
    }

    const { avatarUrl } = result.value;

    return {
      avatarUrl,
    };
  }
}
