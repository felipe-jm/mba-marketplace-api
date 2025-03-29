import { Get, BadRequestException, Param, Controller } from "@nestjs/common";
import { GetProductByIdUseCase } from "@/domain/marketplace/application/use-cases/get-product-by-id";
import { ProductDetailsPresenter } from "@/infra/http/presenters/product-details-presenter";

@Controller("/products/:id")
export class GetProductByIdController {
  constructor(private readonly getProductById: GetProductByIdUseCase) {}

  @Get()
  async handle(@Param("id") id: string) {
    const result = await this.getProductById.execute({
      productId: id,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { product } = result.value;

    return { product: ProductDetailsPresenter.toHTTP(product) };
  }
}
