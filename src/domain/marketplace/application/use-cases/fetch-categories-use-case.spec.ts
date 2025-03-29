import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { FetchCategoriesUseCase } from "./fetch-categories-use-case";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeCategory } from "test/factories/make-category";

describe("Fetch Categories Use Case", () => {
  let inMemoryCategoriesRepository: InMemoryCategoriesRepository;
  let sut: FetchCategoriesUseCase;

  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoriesUseCase(inMemoryCategoriesRepository);
  });

  it("should be able to fetch categories", async () => {
    const category = makeCategory({
      title: "Category 1",
      slug: Slug.createFromText("category-1"),
    });

    inMemoryCategoriesRepository.items.push(category);

    const category2 = makeCategory({
      title: "Category 2",
      slug: Slug.createFromText("category-2"),
    });

    inMemoryCategoriesRepository.items.push(category2);

    const category3 = makeCategory({
      title: "Category 3",
      slug: Slug.createFromText("category-3"),
    });

    inMemoryCategoriesRepository.items.push(category3);

    const categories = await sut.execute();

    expect(categories.isRight()).toBe(true);
    expect(categories.value).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({
          id: category.id,
          title: category.title,
          slug: category.slug,
        }),
        expect.objectContaining({
          id: category2.id,
          title: category2.title,
          slug: category2.slug,
        }),
        expect.objectContaining({
          id: category3.id,
          title: category3.title,
          slug: category3.slug,
        }),
      ]),
    });
  });
});
