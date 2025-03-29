import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { SellersRepository } from "../repositories/sellers-repository";
import { Seller } from "../../enterprise/entities/seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { HashGenerator } from "../cryptography/hash-generator";
import { SellerAlreadyExistsError } from "./errors/seller-already-exists-error";
import { PasswordDoesNotMatchError } from "./errors/password-does-not-match-error";

interface RegisterSellerUseCaseRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  avatarId?: UniqueEntityId;
}

type RegisterSellerUseCaseResponse = Either<
  SellerAlreadyExistsError,
  {
    seller: Seller;
  }
>;

@Injectable()
export class RegisterSellerUseCase {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    phone,
    password,
    passwordConfirmation,
    avatarId,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    if (password !== passwordConfirmation) {
      return left(new PasswordDoesNotMatchError());
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

    const seller = Seller.create({
      name,
      email,
      phone,
      password: hashPassword,
      avatarId,
    });

    await this.sellersRepository.create(seller);

    return right({
      seller,
    });
  }
}
