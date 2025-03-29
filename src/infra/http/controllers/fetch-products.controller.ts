import { FetchProductsUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-use-case";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ProductPresenter } from "../presenters/product-presenter";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { z } from "zod";

const fetchProductsQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

type FetchProductsQueryParamsSchema = z.infer<
  typeof fetchProductsQueryParamsSchema
>;

const fetchProductsValidationPipe = new ZodValidationPipe(
  fetchProductsQueryParamsSchema
);

@Controller("/products")
export class FetchProductsController {
  constructor(private readonly fetchProductsUseCase: FetchProductsUseCase) {}

  @Get()
  async handle(
    @Query(fetchProductsValidationPipe) query: FetchProductsQueryParamsSchema
  ) {
    const { page, status, title, description } = query;

    const result = await this.fetchProductsUseCase.execute({
      page,
      status,
      title,
      description,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { products } = result.value;

    return { products: products.map(ProductPresenter.toHTTP) };
  }
}
