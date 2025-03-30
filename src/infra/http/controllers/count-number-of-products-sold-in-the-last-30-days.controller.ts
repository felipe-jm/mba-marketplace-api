import { CountNumberOfProductsSoldInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-products-sold-in-the-last-30-days-use-case";
import { BadRequestException, Controller, Get } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/sellers/metrics/products/sold")
export class CountNumberOfProductsSoldInTheLast30DaysController {
  constructor(
    private readonly countNumberOfProductsSoldInTheLast30DaysUseCase: CountNumberOfProductsSoldInTheLast30DaysUseCase
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result =
      await this.countNumberOfProductsSoldInTheLast30DaysUseCase.execute({
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
