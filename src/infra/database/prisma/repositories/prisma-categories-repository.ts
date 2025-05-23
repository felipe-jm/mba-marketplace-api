import { CategoriesRepository } from "@/domain/marketplace/application/repositories/categories-repository";
import { Category } from "@/domain/marketplace/enterprise/entities/category";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }

  async listAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();

    if (!categories) {
      return [];
    }

    return categories.map(PrismaCategoryMapper.toDomain);
  }

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrismaCreate(category);

    await this.prisma.category.create({ data });
  }
}
