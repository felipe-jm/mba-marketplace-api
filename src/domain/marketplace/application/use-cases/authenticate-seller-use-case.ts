import { Either, left, right } from "@/core/either";
import { SellersRepository } from "../repositories/sellers-repository";
import { Injectable } from "@nestjs/common";
import { HashComparer } from "../cryptography/hash-comparer";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { Encrypter } from "../cryptography/encrypter";

interface AuthenticateSellerUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateSellerUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateSellerUseCase {
  constructor(
    private readonly sellersRepository: SellersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateSellerUseCaseRequest): Promise<AuthenticateSellerUseCaseResponse> {
    const seller = await this.sellersRepository.findByEmail(email);

    if (!seller) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      seller.password
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: seller.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
