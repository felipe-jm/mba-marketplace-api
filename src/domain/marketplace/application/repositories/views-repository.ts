import { View } from "../../enterprise/entities/view";

export abstract class ViewsRepository {
  abstract create(view: View): Promise<void>;
  abstract findByProductIdAndUserId(
    productId: string,
    userId: string
  ): Promise<View | null>;
  abstract findManyViewsInTheLast30Days(): Promise<number>;
  abstract findManyViewsInTheLast30DaysByDay(): Promise<{
    viewsPerDay: Array<{
      date: string | null;
      amount: number;
    }>;
  }>;
  abstract findManyViewsInTheLast7DaysByProductId(
    productId: string
  ): Promise<number>;
}
