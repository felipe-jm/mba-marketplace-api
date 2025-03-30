import { Seller } from "@/domain/marketplace/enterprise/entities/seller";

export class SellerPresenter {
  static toHTTP(seller: Seller) {
    return {
      id: seller.id.toString(),
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
    };
  }
}
