import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products-repository";
import { SellersRepository } from "../repositories/sellers-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface CountNumberOfProductsAvailableInTheLast30DaysUseCaseRequest {
  sellerId: string;
}

type CountNumberOfProductsAvailableInTheLast30DaysUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    amount: number;
  }
>;

@Injectable()
export class CountNumberOfProductsAvailableInTheLast30DaysUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly sellersRepository: SellersRepository
  ) {}

  async execute({
    sellerId,
  }: CountNumberOfProductsAvailableInTheLast30DaysUseCaseRequest): Promise<CountNumberOfProductsAvailableInTheLast30DaysUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError());
    }

    const amount =
      await this.productsRepository.findManyAvailableInTheLast30Days();

    return right({
      amount,
    });
  }
}
