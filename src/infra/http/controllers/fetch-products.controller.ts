import { FetchProductsUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-use-case";
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ProductPresenter } from "../presenters/product-presenter";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { z } from "zod";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

const fetchProductsQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.string().optional(),
  search: z.string().optional(),
  categories: z
    .string()
    .optional()
    .transform((value) => value?.split(",")),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

type FetchProductsQueryParamsSchema = z.infer<
  typeof fetchProductsQueryParamsSchema
>;

const fetchProductsValidationPipe = new ZodValidationPipe(
  fetchProductsQueryParamsSchema
);

// Swagger Response DTO
class ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  sellerId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

class ProductsListResponseDTO {
  products: ProductResponseDTO[];
}

@Controller("/products")
@ApiTags("products")
export class FetchProductsController {
  constructor(private readonly fetchProductsUseCase: FetchProductsUseCase) {}

  @Get()
  @UsePipes()
  @ApiOperation({ summary: "Fetch products with optional filtering" })
  @ApiQuery({
    name: "page",
    type: Number,
    required: false,
    description: "Page number, defaults to 1",
  })
  @ApiQuery({
    name: "status",
    type: String,
    required: false,
    description: "Product status filter",
  })
  @ApiQuery({
    name: "search",
    type: String,
    required: false,
    description: "Search term for products",
  })
  @ApiQuery({
    name: "categories",
    type: String,
    required: false,
    description: "Comma-separated list of category IDs",
  })
  @ApiQuery({
    name: "minPrice",
    type: Number,
    required: false,
    description: "Minimum product price",
  })
  @ApiQuery({
    name: "maxPrice",
    type: Number,
    required: false,
    description: "Maximum product price",
  })
  @ApiResponse({
    status: 200,
    description: "List of products",
    type: ProductsListResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
  })
  async fetchProducts(
    @Query(fetchProductsValidationPipe) query: FetchProductsQueryParamsSchema
  ) {
    const { page, status, search, categories, minPrice, maxPrice } = query;

    const result = await this.fetchProductsUseCase.execute({
      page,
      status,
      search,
      categories,
      minPrice,
      maxPrice,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { products } = result.value;

    return { products: products.map(ProductPresenter.toHTTP) };
  }
}
