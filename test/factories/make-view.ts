import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { View, ViewProps } from "@/domain/marketplace/enterprise/entities/view";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaProductViewMapper } from "@/infra/database/prisma/mappers/prisma-view-mapper";
import { Injectable } from "@nestjs/common";

export function makeView(
  override: Partial<ViewProps> = {},
  id?: UniqueEntityId
) {
  const view = View.create(
    {
      productId: new UniqueEntityId().toString(),
      userId: new UniqueEntityId().toString(),
      createdAt: new Date(),
      ...override,
    },
    id
  );

  return view;
}

@Injectable()
export class ViewFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaView(data: Partial<ViewProps> = {}): Promise<View> {
    const view = makeView(data);

    await this.prisma.productView.create({
      data: PrismaProductViewMapper.toPrisma(view),
    });

    return view;
  }
}
