import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Public } from "@/infra/auth/public";
import { AuthenticateSellerUseCase } from "@/domain/marketplace/application/use-cases/authenticate-seller-use-case";
import { WrongCredentialsError } from "@/domain/marketplace/application/use-cases/errors/wrong-credentials-error";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private readonly authenticateSeller: AuthenticateSellerUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateSeller.execute({ email, password });

    if (result.isLeft()) {
      const error = result.value;

      if (error.constructor === WrongCredentialsError) {
        throw new ForbiddenException(error.message);
      } else {
        throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
