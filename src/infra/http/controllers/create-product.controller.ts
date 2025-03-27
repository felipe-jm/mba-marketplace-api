import { z } from "zod";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CreateProductUseCase } from "@/domain/marketplace/application/use-cases/create-product-use-case";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";

const createProductBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInCents: z.number().nonnegative(),
  categoryId: z.string().uuid(),
  status: z.enum(Object.values(ProductStatus) as [string, ...string[]]),
});

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema);

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>;

@Controller("/products")
export class CreateProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateProductBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, description, priceInCents, categoryId } = body;
    const userId = user.sub;

    const result = await this.createProduct.execute({
      title,
      description,
      priceInCents,
      categoryId,
      ownerId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
