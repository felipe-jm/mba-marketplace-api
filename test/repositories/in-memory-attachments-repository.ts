import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachments-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }

  async findById(id: string): Promise<Attachment | null> {
    const attachment = this.items.find((item) =>
      item.id.equals(new UniqueEntityId(id))
    );
    return attachment ?? null;
  }
}
