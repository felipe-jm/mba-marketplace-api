import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product } from "../../enterprise/entities/product";
import { ProductsRepository } from "../repositories/products-repository";

interface CreateProductUseCaseRequest {
  title: string;
  description: string;
  priceInCents: number;
  ownerId: string;
  categoryId: string;
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product;
  }
>;

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    title,
    description,
    priceInCents,
    ownerId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      title,
      description,
      priceInCents,
      ownerId: new UniqueEntityId(ownerId),
      categoryId: new UniqueEntityId(categoryId),
    });

    await this.productsRepository.create(product);

    return right({
      product,
    });
  }
}
