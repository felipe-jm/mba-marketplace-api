import { Controller, Get, BadRequestException } from "@nestjs/common";
import { FetchCategoriesUseCase } from "@/domain/marketplace/application/use-cases/fetch-categories-use-case";
import { CategoryPresenter } from "../presenters/category-presenter";

@Controller("/categories")
export class FetchCategoriesController {
  constructor(private readonly fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchCategories.execute();

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { categories } = result.value;

    return { categories: categories.map(CategoryPresenter.toHTTP) };
  }
}
