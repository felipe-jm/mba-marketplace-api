import { FetchProductsBySellerUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-by-seller-use-case";
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ProductPresenter } from "../presenters/product-presenter";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { z } from "zod";

const fetchProductsQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.string().optional(),
  search: z.string().optional(),
});

type FetchProductsQueryParamsSchema = z.infer<
  typeof fetchProductsQueryParamsSchema
>;

const fetchProductsValidationPipe = new ZodValidationPipe(
  fetchProductsQueryParamsSchema
);

@Controller("/seller/products")
export class FetchSellerProductsController {
  constructor(
    private readonly fetchProductsBySellerUseCase: FetchProductsBySellerUseCase
  ) {}

  @Get()
  @UsePipes()
  async fetchProductsBySeller(
    @Query(fetchProductsValidationPipe) query: FetchProductsQueryParamsSchema,
    @CurrentUser() user: UserPayload
  ) {
    const { page, status, search } = query;

    const result = await this.fetchProductsBySellerUseCase.execute({
      page,
      status,
      search,
      sellerId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { products } = result.value;

    return { products: products.map(ProductPresenter.toHTTP) };
  }
}
