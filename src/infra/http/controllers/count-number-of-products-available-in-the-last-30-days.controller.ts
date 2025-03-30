import { CountNumberOfProductsAvailableInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-products-available-in-the-last-30-days-use-case";
import { BadRequestException, Controller, Get } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/sellers/metrics/products/available")
export class CountNumberOfProductsAvailableInTheLast30DaysController {
  constructor(
    private readonly countNumberOfProductsAvailableInTheLast30DaysUseCase: CountNumberOfProductsAvailableInTheLast30DaysUseCase
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result =
      await this.countNumberOfProductsAvailableInTheLast30DaysUseCase.execute({
        sellerId: user.sub,
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
