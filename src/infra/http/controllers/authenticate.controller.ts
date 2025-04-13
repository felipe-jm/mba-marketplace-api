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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Swagger DTO
class AuthenticateDTO {
  email: string;
  password: string;
}

// Swagger Response DTO
class SellerDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
}

class AuthTokenResponseDTO {
  access_token: string;
  refresh_token: string;
  seller: SellerDTO;
}

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
@Public()
@ApiTags("authentication")
export class AuthenticateController {
  constructor(private readonly authenticateSeller: AuthenticateSellerUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: "Authenticate a seller" })
  @ApiBody({ type: AuthenticateDTO })
  @ApiResponse({
    status: 200,
    description: "Authentication successful",
    type: AuthTokenResponseDTO,
  })
  @ApiResponse({
    status: 403,
    description: "Wrong credentials",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
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

    const { accessToken, refreshToken, seller } = result.value;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      seller,
    };
  }
}
