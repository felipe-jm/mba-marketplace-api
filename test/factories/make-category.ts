import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Category,
  CategoryProps,
} from "@/domain/marketplace/enterprise/entities/category";
import { Slug } from "@/domain/marketplace/enterprise/entities/value-objects/slug";
import { PrismaCategoryMapper } from "@/infra/database/prisma/mappers/prisma-category-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityId
) {
  const category = Category.create(
    {
      title: faker.lorem.sentence(),
      slug: Slug.createFromText(faker.lorem.sentence()),
      ...override,
    },
    id
  );

  return category;
}

@Injectable()
export class CategoryFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {}
  ): Promise<Category> {
    const category = makeCategory(data);

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrismaCreate(category),
    });

    return category;
  }
}
