import {
  FindManyBySellerParams,
  FindManyParams,
  ProductsRepository,
} from "@/domain/marketplace/application/repositories/products-repository";
import {
  Product,
  ProductStatus,
} from "@/domain/marketplace/enterprise/entities/product";
import { ProductDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-details";
import { InMemorySellersRepository } from "./in-memory-sellers-repository";
import { InMemoryCategoriesRepository } from "./in-memory-categories-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  constructor(
    private readonly sellersRepository: InMemorySellersRepository,
    private readonly categoriesRepository: InMemoryCategoriesRepository,
    private readonly attachmentsRepository: InMemoryAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    if (product.attachmentId) {
      const attachment = await this.attachmentsRepository.findById(
        product.attachmentId.toString()
      );

      if (attachment) {
        product.attachment = attachment;
      }
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

  findMany(params: FindManyParams): Promise<Product[]> {
    const { search, status, page } = params;

    const sortedItems = [...this.items];
    sortedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    let products = sortedItems.slice((page - 1) * 20, page * 20);

    if (status) {
      products = products.filter((product) => product.status === status);
    }

    if (search) {
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return Promise.resolve(products);
  }

  findManyBySeller(params: FindManyBySellerParams): Promise<Product[]> {
    const { search, status, page, sellerId } = params;

    const sortedItems = [...this.items];
    sortedItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    let products = sortedItems.slice((page - 1) * 20, page * 20);

    if (status) {
      products = products.filter((product) => product.status === status);
    }

    if (search) {
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    products = products.filter(
      (product) => product.ownerId.toString() === sellerId
    );

    return Promise.resolve(products);
  }

  async save(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === product.id);

    this.items[itemIndex] = product;
  }

  async create(product: Product): Promise<void> {
    this.items.push(product);
  }

  async findManySoldInTheLast30Days(): Promise<number> {
    const products = this.items.filter(
      (product) => product.status === ProductStatus.SOLD
    );

    return Promise.resolve(products.length);
  }

  async findManyAvailableInTheLast30Days(): Promise<number> {
    const products = this.items.filter(
      (product) => product.status === ProductStatus.AVAILABLE
    );

    return Promise.resolve(products.length);
  }
}
