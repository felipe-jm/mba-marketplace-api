import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { SellerAlreadyExistsError } from "@/domain/marketplace/application/use-cases/errors/seller-already-exists-error";
import { EditSellerUseCase } from "@/domain/marketplace/application/use-cases/edit-seller-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { PasswordDoesNotMatchError } from "@/domain/marketplace/application/use-cases/errors/password-does-not-match-error";

const editAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().optional(),
  passwordConfirmation: z.string().optional(),
});

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema);

@Controller("/sellers/me")
export class EditAccountController {
  constructor(private readonly editSeller: EditSellerUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes()
  async handle(
    @Body(bodyValidationPipe) body: EditAccountBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { sub } = user;
    const { name, email, phone, password, passwordConfirmation } = body;

    const result = await this.editSeller.execute({
      sellerId: sub,
      name,
      email,
      phone,
      password,
      passwordConfirmation,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === SellerAlreadyExistsError) {
        throw new ConflictException(error.message);
      } else if (error.constructor === PasswordDoesNotMatchError) {
        throw new BadRequestException();
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
