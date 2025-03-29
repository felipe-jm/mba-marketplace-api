import { Product } from "../../enterprise/entities/product";
import { ProductDetails } from "../../enterprise/entities/value-objects/product-details";

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>;
  abstract findDetailsById(id: string): Promise<ProductDetails | null>;
  abstract save(product: Product): Promise<void>;
  abstract create(product: Product): Promise<void>;
}
