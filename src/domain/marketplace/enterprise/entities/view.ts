import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface ViewProps {
  productId: string;
  userId: string;
  createdAt: Date;
}

export class View extends Entity<ViewProps> {
  get productId() {
    return this.props.productId;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: ViewProps, id?: UniqueEntityId) {
    const view = new View(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return view;
  }
}
