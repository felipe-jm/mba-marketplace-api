import { Injectable } from "@nestjs/common";
import { SellersRepository } from "../repositories/sellers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ViewsRepository } from "../repositories/views-repository";

interface CountNumberOfViewsInTheLast30DaysUseCaseRequest {
  sellerId: string;
}

type CountNumberOfViewsInTheLast30DaysUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    amount: number;
  }
>;

@Injectable()
export class CountNumberOfViewsInTheLast30DaysUseCase {
  constructor(
    private readonly viewsRepository: ViewsRepository,
    private readonly sellersRepository: SellersRepository
  ) {}

  async execute({
    sellerId,
  }: CountNumberOfViewsInTheLast30DaysUseCaseRequest): Promise<CountNumberOfViewsInTheLast30DaysUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError());
    }

    const amount = await this.viewsRepository.findManyViewsInTheLast30Days();

    return right({
      amount,
    });
  }
}
