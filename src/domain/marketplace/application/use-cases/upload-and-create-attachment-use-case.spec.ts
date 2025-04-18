import { UploadAndCreateAttachmentUseCase } from "@/domain/marketplace/application/use-cases/upload-and-create-attachment-use-case";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentType } from "@/domain/marketplace/application/use-cases/errors/invalid-attachment-type";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and Create Attachment Use Case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "test.png",
      fileType: "image/png",
      body: Buffer.from("test"),
    });

    expect(result.isRight()).toBe(true);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "test.png",
      })
    );
  });

  it("should not be able to upload an attachment with an invalid file type", async () => {
    const result = await sut.execute({
      fileName: "test.txt",
      fileType: "text/plain",
      body: Buffer.from("test"),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
