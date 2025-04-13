import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  AttachmentProps,
} from "@/domain/marketplace/enterprise/entities/attachment";
import { faker } from "@faker-js/faker";

type Override = Partial<AttachmentProps>;

export function makeAttachment(override: Override = {}, id?: UniqueEntityId) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.internet.url(),
      ...override,
    },
    id
  );

  return attachment;
}
