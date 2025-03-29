import { ProductsRepository } from "../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { ProductDetails } from "../../enterprise/entities/value-objects/product-details";

interface GetProductByIdUseCaseRequest {
  productId: string;
}

type GetProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: ProductDetails;
  }
>;

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute({
    productId,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productRepository.findDetailsById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({ product });
  }
}
