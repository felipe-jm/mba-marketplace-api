import { CountNumberOfViewsInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-views-in-the-last-30-days-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get } from "@nestjs/common";

@Controller("/sellers/metrics/views")
export class CountNumberOfViewsInTheLast30DaysController {
  constructor(
    private readonly countNumberOfViewsInTheLast30DaysUseCase: CountNumberOfViewsInTheLast30DaysUseCase
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.countNumberOfViewsInTheLast30DaysUseCase.execute({
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
