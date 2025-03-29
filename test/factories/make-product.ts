import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Product,
  ProductProps,
} from "@/domain/marketplace/enterprise/entities/product";
import { PrismaProductMapper } from "@/infra/database/prisma/mappers/prisma-product-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {
  const product = Product.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      priceInCents: faker.number.int({ min: 100, max: 10000 }),
      ownerId: new UniqueEntityId("owner-1"),
      categoryId: new UniqueEntityId("category-1"),
      ...override,
    },
    id
  );

  return product;
}

@Injectable()
export class ProductFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data);

    await this.prisma.product.create({
      data: PrismaProductMapper.toPrismaCreate(product),
    });

    return product;
  }
}
