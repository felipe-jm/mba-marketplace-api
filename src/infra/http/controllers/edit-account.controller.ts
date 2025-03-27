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

const editAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
});

type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>;

@Controller("/sellers/me")
export class EditAccountController {
  constructor(private readonly editSeller: EditSellerUseCase) {}

  @Put()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(editAccountBodySchema))
  async handle(
    @Body() body: EditAccountBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    console.log("RAW BODY RECEIVED:", body);
    console.log("BODY TYPE:", typeof body);
    console.log("BODY KEYS:", Object.keys(body));
    console.log("IS EMPTY?", Object.keys(body).length === 0);

    const { sub } = user;
    console.log("EditAccountController BODY", body);
    const { name, email, password, phone } = body;

    const result = await this.editSeller.execute({
      sellerId: sub,
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
