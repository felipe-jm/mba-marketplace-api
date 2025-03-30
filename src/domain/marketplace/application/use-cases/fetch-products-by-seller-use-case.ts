import { ProductsRepository } from "../repositories/products-repository";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Product } from "../../enterprise/entities/product";
import { SellersRepository } from "../repositories/sellers-repository";
import { SellerNotFoundError } from "./errors/seller-not-found-error";

interface FetchProductsBySellerUseCaseRequest {
  page: number;
  status?: string;
  search?: string;
  sellerId: string;
}

type FetchProductsBySellerUseCaseResponse = Either<
  SellerNotFoundError,
  {
    products: Product[];
  }
>;

@Injectable()
export class FetchProductsBySellerUseCase {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly sellerRepository: SellersRepository
  ) {}

  async execute({
    page,
    status,
    search,
    sellerId,
  }: FetchProductsBySellerUseCaseRequest): Promise<FetchProductsBySellerUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      return left(new SellerNotFoundError(sellerId));
    }

    const products = await this.productRepository.findManyBySeller({
      page,
      status,
      search,
      sellerId,
    });

    return right({ products });
  }
}
