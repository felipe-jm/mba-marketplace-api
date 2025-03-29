import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Public } from "@/infra/auth/public";
import { RegisterSellerUseCase } from "@/domain/marketplace/application/use-cases/register-seller-use-case";
import { SellerAlreadyExistsError } from "@/domain/marketplace/application/use-cases/errors/seller-already-exists-error";
import { PasswordDoesNotMatchError } from "@/domain/marketplace/application/use-cases/errors/password-does-not-match-error";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  phone: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/sellers")
@Public()
export class CreateAccountController {
  constructor(private readonly registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, phone, passwordConfirmation } = body;

    const result = await this.registerSeller.execute({
      name,
      email,
      password,
      phone,
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
