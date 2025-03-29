import { ProductDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-details";

export class ProductDetailsPresenter {
  static toHTTP(product: ProductDetails) {
    return {
      id: product.productId.toString(),
      ownerId: product.ownerId.toString(),
      ownerName: product.ownerName,
      categoryId: product.categoryId.toString(),
      categoryTitle: product.categoryTitle,
      title: product.title,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
