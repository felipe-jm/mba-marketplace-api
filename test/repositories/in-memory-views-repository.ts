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

  async findManyViewsInTheLast30Days(): Promise<number> {
    const views = this.items.filter(
      (view) =>
        view.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    return Promise.resolve(views.length);
  }

  async findManyViewsInTheLast30DaysByDay(): Promise<{
    viewsPerDay: Array<{
      date: string | null;
      amount: number;
    }>;
  }> {
    const views = this.items.filter(
      (view) =>
        view.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const viewsPerDay = views.reduce((acc, view) => {
      const day = view.createdAt.toISOString().split("T")[0];
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day]++;
      return acc;
    }, {});

    return Promise.resolve({
      viewsPerDay: Object.entries(viewsPerDay).map(([date, amount]) => ({
        date,
        amount: amount as number,
      })),
    });
  }

  async findManyViewsInTheLast7DaysByProductId(
    productId: string
  ): Promise<number> {
    const views = this.items.filter((view) => view.productId === productId);
    const viewsInTheLast7Days = views.filter(
      (view) => view.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    return Promise.resolve(viewsInTheLast7Days.length);
  }
}
