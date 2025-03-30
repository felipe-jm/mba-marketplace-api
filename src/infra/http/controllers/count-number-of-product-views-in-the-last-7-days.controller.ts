import { CountNumberOfProductViewsInTheLast7DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-product-views-in-the-last-7-days-use-case";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";

@Controller("/products/:productId/metrics/views")
export class CountNumberOfProductViewsInTheLast7DaysController {
  constructor(
    private readonly countNumberOfProductViewsInTheLast7DaysUseCase: CountNumberOfProductViewsInTheLast7DaysUseCase
  ) {}

  @Get()
  async handle(@Param("productId") productId: string) {
    const result =
      await this.countNumberOfProductViewsInTheLast7DaysUseCase.execute({
        productId: productId,
      });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { amount } = result.value;

    return {
      amount,
    };
  }
}
