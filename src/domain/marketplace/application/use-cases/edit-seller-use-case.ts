import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { SellersRepository } from "../repositories/sellers-repository";
import { Seller } from "../../enterprise/entities/seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { HashGenerator } from "../cryptography/hash-generator";
import { SellerAlreadyExistsError } from "./errors/seller-already-exists-error";
import { SellerNotFoundError } from "./errors/seller-not-found-error";
import { PasswordDoesNotMatchError } from "./errors/password-does-not-match-error";

interface EditSellerUseCaseRequest {
  sellerId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  avatarId?: UniqueEntityId;
}

type EditSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  {
    seller: Seller;
  }
>;

@Injectable()
export class EditSellerUseCase {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    sellerId,
    name,
    email,
    phone,
    password,
    passwordConfirmation,
    avatarId,
  }: EditSellerUseCaseRequest): Promise<EditSellerUseCaseResponse> {
    if (password !== passwordConfirmation) {
      return left(new PasswordDoesNotMatchError());
    }

    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      return left(new SellerNotFoundError(sellerId));
    }

    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email);

    if (sellerWithSameEmail) {
      return left(new SellerAlreadyExistsError());
    }

    const sellerWithSamePhone = await this.sellersRepository.findByPhone(phone);

    if (sellerWithSamePhone) {
      return left(new SellerAlreadyExistsError());
    }

    const hashPassword = await this.hashGenerator.hash(password);

    seller.name = name;
    seller.email = email;
    seller.phone = phone;
    seller.password = hashPassword;
    seller.avatarId = avatarId;

    await this.sellersRepository.save(seller);

    return right({
      seller,
    });
  }
}
