import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ViewsRepository } from "../repositories/views-repository";
import { ProductsRepository } from "../repositories/products-repository";

interface CountNumberOfProductViewsInTheLast7DaysUseCaseRequest {
  productId: string;
}

type CountNumberOfProductViewsInTheLast7DaysUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    amount: number;
  }
>;

@Injectable()
export class CountNumberOfProductViewsInTheLast7DaysUseCase {
  constructor(
    private readonly viewsRepository: ViewsRepository,
    private readonly productsRepository: ProductsRepository
  ) {}

  async execute({
    productId,
  }: CountNumberOfProductViewsInTheLast7DaysUseCaseRequest): Promise<CountNumberOfProductViewsInTheLast7DaysUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const amount =
      await this.viewsRepository.findManyViewsInTheLast7DaysByProductId(
        productId
      );

    return right({
      amount,
    });
  }
}
