import { CountNumberOfViewsInTheLast30DaysByDayUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-views-in-the-last-30-days-by-day-use-case";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get } from "@nestjs/common";

@Controller("/sellers/metrics/views/days")
export class CountNumberOfViewsInTheLast30DaysByDayController {
  constructor(
    private readonly countNumberOfViewsInTheLast30DaysByDayUseCase: CountNumberOfViewsInTheLast30DaysByDayUseCase
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result =
      await this.countNumberOfViewsInTheLast30DaysByDayUseCase.execute({
        sellerId: user.sub,
      });

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message);
    }

    const { viewsPerDay } = result.value;

    return {
      viewsPerDay,
    };
  }
}
