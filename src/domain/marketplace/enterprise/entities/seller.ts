import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";

export interface SellerProps {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation?: string;
  avatarId?: UniqueEntityId;
  avatar?: Attachment;
}

export class Seller extends Entity<SellerProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  get avatarId() {
    return this.props.avatarId;
  }

  get avatar() {
    return this.props.avatar;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  set avatarId(avatarId: UniqueEntityId | undefined) {
    if (avatarId === undefined) {
      return;
    }
    this.props.avatarId = avatarId;
  }

  set avatar(avatar: Attachment | undefined) {
    if (avatar === undefined) {
      return;
    }
    this.props.avatar = avatar;
  }

  static create(props: SellerProps, id?: UniqueEntityId) {
    const seller = new Seller(props, id);

    return seller;
  }
}
