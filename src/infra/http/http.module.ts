import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateProductController } from "./controllers/create-product.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateProductUseCase } from "@/domain/marketplace/application/use-cases/create-product-use-case";
import { AuthenticateSellerUseCase } from "@/domain/marketplace/application/use-cases/authenticate-seller-use-case";
import { RegisterSellerUseCase } from "@/domain/marketplace/application/use-cases/register-seller-use-case";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { EditAccountController } from "./controllers/edit-account.controller";
import { EditSellerUseCase } from "@/domain/marketplace/application/use-cases/edit-seller-use-case";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/domain/marketplace/application/use-cases/upload-and-create-attachment-use-case";
import { StorageModule } from "../storage/storage.module";
import { EditProductController } from "./controllers/edit-product.controller";
import { EditProductUseCase } from "@/domain/marketplace/application/use-cases/edit-product-use-case";
import { GetProductByIdController } from "./controllers/get-product-by-id.controller";
import { GetProductByIdUseCase } from "@/domain/marketplace/application/use-cases/get-product-by-id";
import { FetchCategoriesController } from "./controllers/fetch-categories.controller";
import { FetchCategoriesUseCase } from "@/domain/marketplace/application/use-cases/fetch-categories-use-case";
import { FetchProductsController } from "./controllers/fetch-products.controller";
import { FetchProductsUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-use-case";
import { FetchProductsBySellerUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-by-seller-use-case";
import { FetchSellerProductsController } from "./controllers/fetch-seller-products.controller";
import { ChangeProductStatusController } from "./controllers/change-product-status.controller";
import { ChangeProductStatusUseCase } from "@/domain/marketplace/application/use-cases/change-product-status-use-case";
import { GetSellerProfileController } from "./controllers/get-seller-profile.controller";
import { GetSellerProfileUseCase } from "@/domain/marketplace/application/use-cases/get-seller-profile-use-case";
import { RegisterProductViewController } from "./controllers/register-product-view.controller";
import { RegisterProductViewUseCase } from "@/domain/marketplace/application/use-cases/register-product-view-use-case";
import { CountNumberOfViewsInTheLast30DaysController } from "./controllers/count-number-of-views-in-the-last-30-days.controller";
import { CountNumberOfViewsInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-views-in-the-last-30-days-use-case";
import { CountNumberOfProductsSoldInTheLast30DaysController } from "./controllers/count-number-of-products-sold-in-the-last-30-days.controller";
import { CountNumberOfProductsSoldInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-products-sold-in-the-last-30-days-use-case";
import { CountNumberOfProductsAvailableInTheLast30DaysController } from "./controllers/count-number-of-products-available-in-the-last-30-days.controller";
import { CountNumberOfProductsAvailableInTheLast30DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-products-available-in-the-last-30-days-use-case";
import { CountNumberOfViewsInTheLast30DaysByDayController } from "./controllers/count-number-of-views-in-the-last-30-days-by-day.controller";
import { CountNumberOfViewsInTheLast30DaysByDayUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-views-in-the-last-30-days-by-day-use-case";
import { CountNumberOfProductViewsInTheLast7DaysController } from "./controllers/count-number-of-product-views-in-the-last-7-days.controller";
import { CountNumberOfProductViewsInTheLast7DaysUseCase } from "@/domain/marketplace/application/use-cases/count-number-of-product-views-in-the-last-7-days-use-case";
import { RefreshTokenController } from "./controllers/refresh-token.controller";
import { RefreshSellerTokenUseCase } from "@/domain/marketplace/application/use-cases/refresh-seller-token-use-case";
import { UpdateSellerAvatarController } from "./controllers/update-seller-avatar.controller";
import { UpdateSellerAvatarUseCase } from "@/domain/marketplace/application/use-cases/update-seller-avatar-use-case";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    EditAccountController,
    UploadAttachmentController,
    EditProductController,
    GetProductByIdController,
    FetchCategoriesController,
    FetchProductsController,
    FetchSellerProductsController,
    ChangeProductStatusController,
    GetSellerProfileController,
    RegisterProductViewController,
    CountNumberOfViewsInTheLast30DaysController,
    CountNumberOfProductsSoldInTheLast30DaysController,
    CountNumberOfProductsAvailableInTheLast30DaysController,
    CountNumberOfViewsInTheLast30DaysByDayController,
    CountNumberOfProductViewsInTheLast7DaysController,
    RefreshTokenController,
    UpdateSellerAvatarController,
  ],
  providers: [
    RegisterSellerUseCase,
    AuthenticateSellerUseCase,
    CreateProductUseCase,
    EditSellerUseCase,
    UploadAndCreateAttachmentUseCase,
    EditProductUseCase,
    GetProductByIdUseCase,
    FetchCategoriesUseCase,
    FetchProductsUseCase,
    FetchProductsBySellerUseCase,
    ChangeProductStatusUseCase,
    GetSellerProfileUseCase,
    RegisterProductViewUseCase,
    CountNumberOfViewsInTheLast30DaysUseCase,
    CountNumberOfProductsSoldInTheLast30DaysUseCase,
    CountNumberOfProductsAvailableInTheLast30DaysUseCase,
    CountNumberOfViewsInTheLast30DaysByDayUseCase,
    CountNumberOfProductViewsInTheLast7DaysUseCase,
    RefreshSellerTokenUseCase,
    UpdateSellerAvatarUseCase,
  ],
})
export class HttpModule {}
