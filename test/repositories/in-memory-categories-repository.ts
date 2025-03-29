import { CategoriesRepository } from "@/domain/marketplace/application/repositories/categories-repository";
import { Category } from "@/domain/marketplace/enterprise/entities/category";

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = [];

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id);

    if (!category) {
      return null;
    }

    return category;
  }

  async listAll(): Promise<Category[] | null> {
    return this.items;
  }

  async create(category: Category): Promise<void> {
    this.items.push(category);
  }
}
