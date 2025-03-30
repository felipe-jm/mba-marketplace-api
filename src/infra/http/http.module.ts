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
  ],
})
export class HttpModule {}
