import {
  Product as PrismaProduct,
  Prisma,
  Attachment as PrismaAttachment,
  User as PrismaSeller,
  Category as PrismaCategory,
} from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Product,
  ProductStatus,
} from "@/domain/marketplace/enterprise/entities/product";

type PrismaProductDetails = PrismaProduct & {
  owner: PrismaSeller;
  category: PrismaCategory | null;
  attachment: PrismaAttachment | null;
};

export class PrismaProductMapper {
  static toDomain(raw: PrismaProductDetails): Product {
    return Product.create(
      {
        title: raw.title,
        description: raw.description,
        priceInCents: raw.priceInCents,
        ownerId: new UniqueEntityId(raw.ownerId),
        categoryId: new UniqueEntityId(raw.categoryId),
        status: raw.status as ProductStatus,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaCreate(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      ownerId: product.ownerId.toString(),
      categoryId: product.categoryId.toString(),
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toPrismaUpdate(product: Product): Prisma.ProductUncheckedUpdateInput {
    return {
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      categoryId: product.categoryId.toString(),
      status: product.status,
      updatedAt: product?.updatedAt,
    };
  }
}
