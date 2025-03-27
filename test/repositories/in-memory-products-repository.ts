import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";

export class InMememoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async save(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);

    this.items[itemIndex] = product;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }
}
