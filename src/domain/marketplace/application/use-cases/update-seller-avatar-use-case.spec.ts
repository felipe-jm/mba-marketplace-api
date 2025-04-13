import { InMemorySellersRepository } from "test/repositories/in-memory-sellers-repository";
import { UpdateSellerAvatarUseCase } from "./update-seller-avatar-use-case";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeAttachment } from "test/factories/make-attachment";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemorySellersRepository: InMemorySellersRepository;
let sut: UpdateSellerAvatarUseCase;

describe("Update Seller Avatar", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemorySellersRepository = new InMemorySellersRepository(
      inMemoryAttachmentsRepository
    );
    sut = new UpdateSellerAvatarUseCase(
      inMemorySellersRepository,
      inMemoryAttachmentsRepository
    );
  });

  it("should be able to update seller avatar", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
      new UniqueEntityId("seller-1")
    );

    const attachment = makeAttachment(
      {
        title: "Avatar image",
        url: "https://example.com/avatar.png",
      },
      new UniqueEntityId("attachment-1")
    );

    await inMemorySellersRepository.create(seller);
    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      avatarId: attachment.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemorySellersRepository.items[0].avatarId).toEqual(
      new UniqueEntityId("attachment-1")
    );

    if (result.isRight()) {
      expect(result.value.avatarUrl).toEqual("https://example.com/avatar.png");
    }
  });

  it("should not be able to update avatar of a non-existing seller", async () => {
    const attachment = makeAttachment(
      {
        title: "Avatar image",
        url: "https://example.com/avatar.png",
      },
      new UniqueEntityId("attachment-1")
    );

    await inMemoryAttachmentsRepository.create(attachment);

    const result = await sut.execute({
      sellerId: "non-existing-seller",
      avatarId: attachment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
  });

  it("should not be able to update avatar with a non-existing attachment", async () => {
    const seller = makeSeller(
      {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "1234567890",
        password: "123456",
      },
      new UniqueEntityId("seller-1")
    );

    await inMemorySellersRepository.create(seller);

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      avatarId: "non-existing-attachment",
    });

    expect(result.isLeft()).toBe(true);
  });
});
