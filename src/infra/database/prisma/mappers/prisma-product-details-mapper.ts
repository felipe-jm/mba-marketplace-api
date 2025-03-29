import {
  Product as PrismaProduct,
  Category as PrismaCategory,
  User as PrismaUser,
} from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import { ProductDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-details";

type PrismaProductDetails = PrismaProduct & {
  category: PrismaCategory | null;
  owner: PrismaUser;
};

export class PrismaProductDetailsMapper {
  static toDomain(raw: PrismaProductDetails): ProductDetails {
    return ProductDetails.create({
      productId: new UniqueEntityId(raw.id),
      title: raw.title,
      description: raw.description,
      priceInCents: raw.priceInCents,
      ownerId: new UniqueEntityId(raw.ownerId),
      ownerName: raw.owner.name,
      categoryId: new UniqueEntityId(raw.categoryId),
      categoryTitle: raw.category?.title ?? "Uncategorized",
      status: raw.status as ProductStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
