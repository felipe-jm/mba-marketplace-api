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

  async findManyViewsInTheLast30Days(): Promise<number> {
    const views = await this.prisma.productView.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return views.length;
  }

  async findManyViewsInTheLast30DaysByDay(): Promise<{
    viewsPerDay: Array<{ date: string | null; amount: number }>;
  }> {
    const views = await this.prisma.productView.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const viewsPerDay = views.reduce((acc, view) => {
      const date = view.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    return {
      viewsPerDay: Object.entries(viewsPerDay).map(([date, amount]) => ({
        date,
        amount: amount as number,
      })),
    };
  }

  async findManyViewsInTheLast7DaysByProductId(
    productId: string
  ): Promise<number> {
    const views = await this.prisma.productView.findMany({
      where: {
        productId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });
    return views.length;
  }
}
