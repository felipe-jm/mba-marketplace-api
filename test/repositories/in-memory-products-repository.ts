import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { ProductDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-details";
import { InMemorySellersRepository } from "./in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "./in-memory-categories-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  constructor(
    private readonly sellersRepository: InMemorySellersRepository,
    private readonly categoriesRepository: InMemoryCategoriesRepository
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async findDetailsById(id: string): Promise<ProductDetails | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    const owner = await this.sellersRepository.findById(
      product.ownerId.toString()
    );

    if (!owner) {
      throw new Error(`Owner with ID ${product.ownerId} not found.`);
    }

    const category = await this.categoriesRepository.findById(
      product.categoryId.toString()
    );

    if (!category) {
      throw new Error(`Category with ID ${product.categoryId} not found.`);
    }

    return ProductDetails.create({
      productId: product.id,
      ownerId: product.ownerId,
      ownerName: owner.name,
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      categoryId: product.categoryId,
      categoryTitle: category.title,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async save(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);

    this.items[itemIndex] = product;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }
}
