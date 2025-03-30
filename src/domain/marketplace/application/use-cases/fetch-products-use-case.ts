import { ProductsRepository } from "../repositories/products-repository";
import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product } from "../../enterprise/entities/product";

interface FetchProductsUseCaseRequest {
  page: number;
  status?: string;
  search?: string;
}

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: Product[];
  }
>;

@Injectable()
export class FetchProductsUseCase {
  constructor(private readonly productRepository: ProductsRepository) {}

  async execute({
    page,
    status,
    search,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productRepository.findMany({
      page,
      status,
      search,
    });

    return right({ products });
  }
}
