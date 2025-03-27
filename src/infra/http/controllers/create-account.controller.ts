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

const createdAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createdAccountBodySchema>;

@Controller("/sellers")
@Public()
export class CreateAccountController {
  constructor(private readonly registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createdAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, phone } = body;

    const result = await this.registerSeller.execute({
      name,
      email,
      password,
      phone,
    });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === SellerAlreadyExistsError) {
        throw new ConflictException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
