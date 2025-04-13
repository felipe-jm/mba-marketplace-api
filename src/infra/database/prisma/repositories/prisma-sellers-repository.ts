import { SellersRepository } from "@/domain/marketplace/application/repositories/sellers-repository";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaSellerMapper } from "../mappers/prisma-seller-mapper";

@Injectable()
export class PrismaSellersRepository implements SellersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Seller | null> {
    try {
      const seller = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          avatar: true,
        },
      });

      if (!seller) {
        return null;
      }

      return PrismaSellerMapper.toDomain(seller);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });

    if (!seller) {
      return null;
    }

    return PrismaSellerMapper.toDomain(seller);
  }

  async findByPhone(phone: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        phone,
      },
      include: {
        avatar: true,
      },
    });

    if (!seller) {
      return null;
    }

    return PrismaSellerMapper.toDomain(seller);
  }

  async save(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPrismaUpdate(seller);

    await this.prisma.user.update({
      where: {
        id: seller.id.toString(),
      },
      data,
    });
  }

  async create(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPrismaCreate(seller);

    await this.prisma.user.create({ data });
  }
}
