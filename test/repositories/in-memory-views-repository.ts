import { ViewsRepository } from "@/domain/marketplace/application/repositories/views-repository";
import { View } from "@/domain/marketplace/enterprise/entities/view";

export class InMemoryViewsRepository implements ViewsRepository {
  public items: View[] = [];

  async create(view: View): Promise<void> {
    this.items.push(view);
  }

  async findByProductIdAndUserId(
    productId: string,
    userId: string
  ): Promise<View | null> {
    const view = this.items.find(
      (item) => item.productId === productId && item.userId === userId
    );

    if (!view) {
      return null;
    }

    return view;
  }
}
