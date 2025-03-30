import { Injectable } from "@nestjs/common";
import { ViewsRepository } from "../repositories/views-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SellersRepository } from "../repositories/sellers-repository";

interface CountNumberOfViewsInTheLast30DaysByDayUseCaseRequest {
  sellerId: string;
}

type CountNumberOfViewsInTheLast30DaysByDayUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    viewsPerDay: Array<{
      date: string | null;
      amount: number;
    }>;
  }
>;

@Injectable()
export class CountNumberOfViewsInTheLast30DaysByDayUseCase {
  constructor(
    private readonly viewsRepository: ViewsRepository,
    private readonly sellersRepository: SellersRepository
  ) {}

  async execute({
    sellerId,
  }: CountNumberOfViewsInTheLast30DaysByDayUseCaseRequest): Promise<CountNumberOfViewsInTheLast30DaysByDayUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError());
    }

    const result =
      await this.viewsRepository.findManyViewsInTheLast30DaysByDay();

    return right({
      viewsPerDay: result.viewsPerDay,
    });
  }
}
