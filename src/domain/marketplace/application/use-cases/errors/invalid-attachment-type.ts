import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidAttachmentType extends Error implements UseCaseError {
  constructor(attachmentType: string) {
    super(`Invalid attachment type: ${attachmentType}`);
  }
}
