import { GetSellerProfileUseCase } from "@/domain/marketplace/application/use-cases/get-seller-profile-use-case";
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { SellerPresenter } from "../presenters/seller-presenter";

@Controller("/sellers/:id")
export class GetSellerProfileController {
  constructor(private readonly getSellerProfile: GetSellerProfileUseCase) {}

  @Get()
  async handle(@Param("id") id: string) {
    const result = await this.getSellerProfile.execute({ sellerId: id });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    const { seller } = result.value;

    return SellerPresenter.toHTTP(seller);
  }
}
