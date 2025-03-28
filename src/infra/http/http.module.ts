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

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    EditAccountController,
  ],
  providers: [
    RegisterSellerUseCase,
    AuthenticateSellerUseCase,
    CreateProductUseCase,
    EditSellerUseCase,
  ],
})
export class HttpModule {}
