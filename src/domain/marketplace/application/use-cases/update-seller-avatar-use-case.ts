import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { SellersRepository } from "../repositories/sellers-repository";
import { Seller } from "../../enterprise/entities/seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { SellerNotFoundError } from "./errors/seller-not-found-error";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface UpdateSellerAvatarUseCaseRequest {
  sellerId: string;
  avatarId: string;
}

type UpdateSellerAvatarUseCaseResponse = Either<
  SellerNotFoundError | ResourceNotFoundError,
  {
    seller: Seller;
    avatarUrl: string;
  }
>;

@Injectable()
export class UpdateSellerAvatarUseCase {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly attachmentsRepository: AttachmentsRepository
  ) {}

  async execute({
    sellerId,
    avatarId,
  }: UpdateSellerAvatarUseCaseRequest): Promise<UpdateSellerAvatarUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new SellerNotFoundError(sellerId));
    }

    const attachment = await this.attachmentsRepository.findById(avatarId);

    if (!attachment) {
      return left(new ResourceNotFoundError());
    }

    seller.avatarId = new UniqueEntityId(avatarId);

    await this.sellersRepository.save(seller);

    return right({
      seller,
      avatarUrl: attachment.url,
    });
  }
}
