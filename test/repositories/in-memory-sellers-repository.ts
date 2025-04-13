import { SellersRepository } from "@/domain/marketplace/application/repositories/sellers-repository";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";

export class InMemorySellersRepository implements SellersRepository {
  constructor(
    private readonly attachmentsRepository: InMemoryAttachmentsRepository
  ) {}

  public items: Seller[] = [];

  async findById(id: string): Promise<Seller | null> {
    const seller = this.items.find((item) => item.id.toString() === id);

    if (!seller) {
      return null;
    }

    if (seller.avatarId) {
      const attachment = await this.attachmentsRepository.findById(
        seller.avatarId.toString()
      );

      if (attachment) {
        seller.avatar = attachment;
      }
    }

    return seller;
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const seller = this.items.find((item) => item.email === email);

    if (!seller) {
      return null;
    }

    return seller;
  }

  async findByPhone(phone: string): Promise<Seller | null> {
    const seller = this.items.find((item) => item.phone === phone);

    if (!seller) {
      return null;
    }

    return seller;
  }

  async save(seller: Seller): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === seller.id);

    this.items[itemIndex] = seller;
  }

  async create(seller: Seller): Promise<void> {
    this.items.push(seller);
  }
}
