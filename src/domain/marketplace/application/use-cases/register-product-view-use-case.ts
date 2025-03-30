import { ProductsRepository } from "../repositories/products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";
import { OwnerViewingOwnProductError } from "./errors/owner-viewing-own-product-error";
import { Product } from "../../enterprise/entities/product";
import { ViewsRepository } from "../repositories/views-repository";
import { View } from "../../enterprise/entities/view";
import { SellersRepository } from "../repositories/sellers-repository";
import { ProductViewAlreadyExistsError } from "./errors/product-view-already-exists";
import { Injectable } from "@nestjs/common";

interface RegisterProductViewUseCaseRequest {
  productId: string;
  userId: string;
}

type RegisterProductViewUseCaseResponse = Either<
  ResourceNotFoundError | OwnerViewingOwnProductError,
  { product: Product }
>;

@Injectable()
export class RegisterProductViewUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly sellersRepository: SellersRepository,
    private readonly viewsRepository: ViewsRepository
  ) {}

  async execute({
    productId,
    userId,
  }: RegisterProductViewUseCaseRequest): Promise<RegisterProductViewUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (product.ownerId.toString() === userId) {
      return left(new OwnerViewingOwnProductError());
    }

    const seller = await this.sellersRepository.findById(userId);

    if (!seller) {
      return left(new ResourceNotFoundError());
    }

    const existingView = await this.viewsRepository.findByProductIdAndUserId(
      productId,
      userId
    );

    if (existingView) {
      return left(new ProductViewAlreadyExistsError());
    }

    const view = View.create({
      productId: product.id.toString(),
      userId: seller.id.toString(),
      createdAt: new Date(),
    });

    await this.viewsRepository.create(view);

    return right({
      product,
    });
  }
}
