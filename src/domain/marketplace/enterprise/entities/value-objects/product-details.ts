import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { ProductStatus } from "@prisma/client";

export interface ProductDetailsProps {
  productId: UniqueEntityId;
  ownerId: UniqueEntityId;
  ownerName: string;
  title: string;
  description: string;
  priceInCents: number;
  status: ProductStatus;
  categoryId: UniqueEntityId;
  categoryTitle: string;
  // attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
  get productId() {
    return this.props.productId;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get ownerName() {
    return this.props.ownerName;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get categoryTitle() {
    return this.props.categoryTitle;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: ProductDetailsProps) {
    return new ProductDetails(props);
  }
}
