import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { RefreshSellerTokenUseCase } from "@/domain/marketplace/application/use-cases/refresh-seller-token-use-case";
import { InvalidRefreshTokenError } from "@/domain/marketplace/application/use-cases/errors/invalid-refresh-token-error";
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from "@nestjs/swagger";
import { Public } from "@/infra/auth/public";

const refreshTokenBodySchema = z.object({
  refreshToken: z.string(),
});

type RefreshTokenBodySchema = z.infer<typeof refreshTokenBodySchema>;

class RefreshTokenDTO {
  refreshToken: string;
}

class SellerDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
}

class TokenResponseDTO {
  access_token: string;
  refresh_token: string;
  seller: SellerDTO;
}

@Controller("/sessions/refresh")
@ApiTags("authentication")
@Public()
export class RefreshTokenController {
  constructor(private refreshSellerToken: RefreshSellerTokenUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Refresh authentication tokens" })
  @ApiBody({ type: RefreshTokenDTO })
  @ApiResponse({
    status: 201,
    description: "Tokens refreshed successfully",
    type: TokenResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid refresh token",
  })
  async handle(
    @Body(new ZodValidationPipe(refreshTokenBodySchema))
    body: RefreshTokenBodySchema
  ) {
    const { refreshToken } = body;

    const result = await this.refreshSellerToken.execute({
      refreshToken,
    });

    if (result.isLeft()) {
      const error = result.value as InvalidRefreshTokenError;
      throw new BadRequestException(error.message);
    }

    const { accessToken, refreshToken: newRefreshToken, seller } = result.value;

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      seller,
    };
  }
}
