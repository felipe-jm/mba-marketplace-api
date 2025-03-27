import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachments-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Attachment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      return null;
    }

    return PrismaAttachmentMapper.toDomain(attachment);
  }

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrismaCreate(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
