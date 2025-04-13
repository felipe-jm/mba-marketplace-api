import dayjs from "dayjs";
import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Attachment } from "./attachment";

export enum ProductStatus {
  AVAILABLE = "available",
  SOLD = "sold",
  CANCELLED = "cancelled",
}

export interface ProductProps {
  title: string;
  description: string;
  priceInCents: number;
  status: ProductStatus;
  ownerId: UniqueEntityId;
  categoryId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
  attachmentId?: UniqueEntityId;
  attachment?: Attachment;
}

export class Product extends Entity<ProductProps> {
  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get priceInCents() {
    return this.props.priceInCents;
  }

  get status() {
    return this.props.status;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get categoryId() {
    return this.props.categoryId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  get attachment() {
    return this.props.attachment;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get excerpt() {
    return this.description.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  set priceInCents(priceInCents: number) {
    this.props.priceInCents = priceInCents;
  }

  set status(status: ProductStatus) {
    this.props.status = status;
  }

  set categoryId(category: UniqueEntityId) {
    this.props.categoryId = category;
  }

  set attachmentId(attachmentId: UniqueEntityId | undefined) {
    if (attachmentId === undefined) {
      return;
    }
    this.props.attachmentId = attachmentId;
  }

  set attachment(attachment: Attachment | undefined) {
    if (attachment === undefined) {
      return;
    }
    this.props.attachment = attachment;
  }

  static create(
    props: Optional<ProductProps, "createdAt" | "status">,
    id?: UniqueEntityId
  ) {
    const product = new Product(
      {
        ...props,
        status: props.status ?? ProductStatus.AVAILABLE,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return product;
  }
}
