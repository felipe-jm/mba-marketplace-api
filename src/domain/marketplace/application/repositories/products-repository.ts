import { PaginationParams } from "@/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";
import { ProductDetails } from "../../enterprise/entities/value-objects/product-details";

export interface FindManyParams extends PaginationParams {
  status?: string;
  search?: string;
}

export interface FindManyBySellerParams extends PaginationParams {
  status?: string;
  search?: string;
  sellerId: string;
}

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findDetailsById(id: string): Promise<ProductDetails | null>;
  abstract save(product: Product): Promise<void>;
  abstract create(product: Product): Promise<void>;
  abstract findMany(params: FindManyParams): Promise<Product[]>;
  abstract findManyBySeller(params: FindManyBySellerParams): Promise<Product[]>;
  abstract findManySoldInTheLast30Days(): Promise<number>;
  abstract findManyAvailableInTheLast30Days(): Promise<number>;
}
