import { View } from "@/domain/marketplace/enterprise/entities/view";
import { ProductView as PrismaProductView } from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class PrismaProductViewMapper {
  static toDomain(view: PrismaProductView): View {
    return View.create(
      {
        productId: view.productId,
        userId: view.userId,
        createdAt: view.createdAt,
      },
      new UniqueEntityId(view.id)
    );
  }
}
