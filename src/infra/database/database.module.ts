import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { PrismaCategoriesRepository } from "./prisma/repositories/prisma-categories-repository";
import { PrismaProductsRepository } from "./prisma/repositories/prisma-products-repository";
import { PrismaSellersRepository } from "./prisma/repositories/prisma-sellers-repository";
import { ProductsRepository } from "@/domain/marketplace/application/repositories/products-repository";
import { SellersRepository } from "@/domain/marketplace/application/repositories/sellers-repository";
import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachments-repository";
import { CategoriesRepository } from "@/domain/marketplace/application/repositories/categories-repository";
import { PrismaViewsRepository } from "./prisma/repositories/prisma-views-respository";
import { ViewsRepository } from "@/domain/marketplace/application/repositories/views-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
    {
      provide: SellersRepository,
      useClass: PrismaSellersRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ViewsRepository,
      useClass: PrismaViewsRepository,
    },
  ],
  exports: [
    PrismaService,
    ProductsRepository,
    SellersRepository,
    AttachmentsRepository,
    CategoriesRepository,
    ViewsRepository,
  ],
})
export class DatabaseModule {}
