import { Category as PrismaCategory, Prisma } from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Category } from "@/domain/marketplace/enterprise/entities/category";
import { Slug } from "@/domain/marketplace/enterprise/entities/value-objects/slug";

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        title: raw.title,
        slug: Slug.createFromText(raw.slug),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaCreate(
    category: Category
  ): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      title: category.title,
      slug: category.slug.value,
    };
  }

  static toPrismaUpdate(
    category: Category
  ): Prisma.CategoryUncheckedUpdateInput {
    return {
      title: category.title,
      slug: category.slug.value,
    };
  }
}
