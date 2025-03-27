import { Attachment as PrismaAttachment, Prisma } from "@prisma/client";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaCreate(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }

  static toPrismaUpdate(
    attachment: Attachment
  ): Prisma.AttachmentUncheckedUpdateInput {
    return {
      title: attachment.title,
      url: attachment.url,
    };
  }
}
