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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  passwordConfirmation: z.string(),
  phone: z.string(),
});

// Swagger DTO
class CreateAccountDTO {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phone: string;
}

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/sellers")
@Public()
@ApiTags("sellers")
export class CreateAccountController {
  constructor(private readonly registerSeller: RegisterSellerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @ApiOperation({ summary: "Create a new seller account" })
  @ApiBody({ type: CreateAccountDTO })
  @ApiResponse({
    status: 201,
    description: "Account created successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Seller already exists",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - validation error or passwords don't match",
  })
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
