import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product } from "../../enterprise/entities/product";
import { ProductsRepository } from "../repositories/products-repository";
import { CategoriesRepository } from "../repositories/categories-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SellersRepository } from "@/domain/marketplace/application/repositories/sellers-repository";

interface CreateProductUseCaseRequest {
  title: string;
  description: string;
  priceInCents: number;
  ownerId: string;
  categoryId: string;
  attachmentId?: string;
}

type CreateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly sellersRepository: SellersRepository
  ) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
    attachmentId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const owner = await this.sellersRepository.findById(ownerId);

    if (!owner) {
      return left(new ResourceNotFoundError());
    }

    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      return left(new ResourceNotFoundError());
    }

    const product = Product.create({
      title,
      description,
      priceInCents,
      ownerId: new UniqueEntityId(ownerId),
      categoryId: new UniqueEntityId(categoryId),
      attachmentId: attachmentId ? new UniqueEntityId(attachmentId) : undefined,
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
