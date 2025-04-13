import { Injectable } from "@nestjs/common";
import { SellersRepository } from "../repositories/sellers-repository";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";
import { Seller } from "../../enterprise/entities/seller";

interface GetSellerProfileUseCaseRequest {
  sellerId: string;
}

type GetSellerProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    seller: Seller;
  }
>;

@Injectable()
export class GetSellerProfileUseCase {
  constructor(private readonly sellersRepository: SellersRepository) {}

  async execute({
    sellerId,
  }: GetSellerProfileUseCaseRequest): Promise<GetSellerProfileUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new ResourceNotFoundError());
    }

    return right({
      seller,
    });
  }
}
