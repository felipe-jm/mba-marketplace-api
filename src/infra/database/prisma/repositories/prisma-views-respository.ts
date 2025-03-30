import { ViewsRepository } from "@/domain/marketplace/application/repositories/views-repository";
import { PrismaService } from "../prisma.service";
import { View } from "@/domain/marketplace/enterprise/entities/view";
import { PrismaProductViewMapper } from "../mappers/prisma-view-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaViewsRepository implements ViewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(view: View): Promise<void> {
    await this.prisma.productView.create({
      data: {
        productId: view.productId.toString(),
        userId: view.userId.toString(),
      },
    });
  }

  async findByProductIdAndUserId(
    productId: string,
    userId: string
  ): Promise<View | null> {
    const view = await this.prisma.productView.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (!view) {
      return null;
    }

    return PrismaProductViewMapper.toDomain(view);
  }
}
