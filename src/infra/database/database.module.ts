import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";
import { PrismaSellersRepository } from "./prisma/repositories/prisma-sellers-repository";
import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import { SellersRepository } from "@/domain/marketplace/application/repositories/sellers-repository";

@Module({
  providers: [
    PrismaService,
    PrismaAttachmentsRepository,
    PrismaCategoriesRepository,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
  ],
  exports: [
    PrismaService,
    PrismaAttachmentsRepository,
    PrismaCategoriesRepository,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
  ],
})
export class DatabaseModule {}
