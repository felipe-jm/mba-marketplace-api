import {
  User as PrismaSeller,
  Prisma,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaSellerDetails = PrismaSeller & {
  avatar: PrismaAttachment | null;
};

export class PrismaSellerMapper {
  static toDomain(raw: PrismaSellerDetails): Seller {
    return Seller.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
        avatar: raw.avatar
          ? PrismaAttachmentMapper.toDomain(raw.avatar)
          : undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaCreate(seller: Seller): Prisma.UserUncheckedCreateInput {
    return {
      id: seller.id.toString(),
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      password: seller.password,
    };
  }

  static toPrismaUpdate(seller: Seller): Prisma.UserUncheckedUpdateInput {
    return {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      password: seller.password,
    };
  }
}
