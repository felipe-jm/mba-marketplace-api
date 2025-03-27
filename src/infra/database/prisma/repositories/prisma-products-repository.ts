import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
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
}
