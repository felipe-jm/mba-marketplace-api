import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product, ProductStatus } from "../../enterprise/entities/product";
import { ProductsRepository } from "../repositories/products-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { CategoriesRepository } from "../repositories/categories-repository";

interface EditProductUseCaseRequest {
  productId: string;
  title: string;
  description: string;
  priceInCents: number;
  ownerId: string;
  categoryId: string;
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product;
  }
>;

@Injectable()
export class EditProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async execute({
    productId,
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    if (ownerId !== product.ownerId.toString()) {
      return left(new NotAllowedError());
    }

    if (product.status === ProductStatus.SOLD) {
      return left(new NotAllowedError());
    }

    if (categoryId !== product.categoryId.toString()) {
      const category = await this.categoriesRepository.findById(categoryId);

      if (!category) {
        return left(new ResourceNotFoundError());
      }
    }

    product.title = title;
    product.description = description;
    product.priceInCents = priceInCents;
    product.categoryId = new UniqueEntityId(categoryId);

    await this.productsRepository.save(product);

    return right({
      product,
    });
  }
}
