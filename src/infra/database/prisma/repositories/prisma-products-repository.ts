import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import {
  Product,
  ProductStatus,
} from "@/domain/marketplace/enterprise/entities/product";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { ProductDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-details";
import { PrismaProductDetailsMapper } from "../mappers/prisma-product-details-mapper";
import { PaginationParams } from "@/core/repositories/pagination-params";

type FindManyParams = PaginationParams & {
  status?: string;
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
};

type FindManyBySellerParams = PaginationParams & {
  status?: string;
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sellerId: string;
};

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        attachment: true,
        owner: true,
        category: true,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findDetailsById(id: string): Promise<ProductDetails | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        owner: true,
        attachment: true,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductDetailsMapper.toDomain(product);
  }

  async findMany({
    page,
    status,
    search,
    categories,
    minPrice,
    maxPrice,
  }: FindManyParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: status ? (status as ProductStatus) : undefined,
        OR: search
          ? [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
        ...(categories?.length ? { categoryId: { in: categories } } : {}),
        ...(minPrice !== undefined ? { priceInCents: { gte: minPrice } } : {}),
        ...(maxPrice !== undefined ? { priceInCents: { lte: maxPrice } } : {}),
      },
      include: {
        attachment: true,
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findManyBySeller({
    page,
    status,
    search,
    categories,
    minPrice,
    maxPrice,
    sellerId,
  }: FindManyBySellerParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      skip: (page - 1) * 20,
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: status ? (status as ProductStatus) : undefined,
        OR: search
          ? [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
        ownerId: sellerId,
        ...(categories?.length ? { categoryId: { in: categories } } : {}),
        ...(minPrice !== undefined ? { priceInCents: { gte: minPrice } } : {}),
        ...(maxPrice !== undefined ? { priceInCents: { lte: maxPrice } } : {}),
      },
      include: {
        attachment: true,
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrismaUpdate(product);

    await this.prisma.product.update({
      where: {
        id: product.id.toString(),
      },
      data,
    });
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrismaCreate(product);

    await this.prisma.product.create({ data });
  }

  async findManySoldInTheLast30Days(): Promise<number> {
    const products = await this.prisma.product.findMany({
      where: {
        status: ProductStatus.SOLD,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return products.length;
  }

  async findManyAvailableInTheLast30Days(): Promise<number> {
    const products = await this.prisma.product.findMany({
      where: {
        status: ProductStatus.AVAILABLE,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return products.length;
  }
}
