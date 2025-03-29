import { CategoriesRepository } from "../repositories/categories-repository";
import { Category } from "../../enterprise/entities/category";
import { Injectable } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

type FetchCategoriesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    categories: Category[];
  }
>;

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.listAll();

    return right({ categories });
  }
}
