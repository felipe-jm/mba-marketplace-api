import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Product, ProductStatus } from "../../enterprise/entities/product";
import { ProductDoesNotBelongToSellerError } from "./errors/product-does-not-belong-to-seller-error";
import { ProductAlreadySoldError } from "./errors/product-already-sold-error";
import { ProductAlreadyCancelledError } from "./errors/product-already-cancelled-error";
import { ProductWithSameStatusError } from "./errors/product-with-same-status-error";

interface ChangeProductStatusUseCaseRequest {
  productId: string;
  status: ProductStatus;
  sellerId: string;
}

type ChangeProductStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  { product: Product }
>;

@Injectable()
export class ChangeProductStatusUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    status,
    productId,
    sellerId,
  }: ChangeProductStatusUseCaseRequest): Promise<ChangeProductStatusUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (product.ownerId.toString() !== sellerId) {
      return left(new ProductDoesNotBelongToSellerError());
    }

    if (product.status === status) {
      return left(new ProductWithSameStatusError());
    }

    if (
      status === ProductStatus.CANCELLED &&
      product.status === ProductStatus.SOLD
    ) {
      return left(new ProductAlreadySoldError());
    }

    if (
      status === ProductStatus.SOLD &&
      product.status === ProductStatus.CANCELLED
    ) {
      return left(new ProductAlreadyCancelledError());
    }

    product.status = status;

    await this.productsRepository.save(product);

    return right({ product });
  }
}
