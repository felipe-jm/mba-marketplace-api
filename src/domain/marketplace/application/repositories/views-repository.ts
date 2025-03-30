import { View } from "../../enterprise/entities/view";

export abstract class ViewsRepository {
  abstract create(view: View): Promise<void>;
  abstract findByProductIdAndUserId(
    productId: string,
    userId: string
  ): Promise<View | null>;
}
