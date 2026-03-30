import { Book } from "../../domain/Book";
import { BookSearchQuery } from "../../domain/BookSearchQuery";
import { Provider } from "../Provider";

// AnotherBookSellerAPI demonstrates how a second provider can be plugged in
// without any changes to BookSearchApiClient or example-client.ts.
// It would follow the same pattern as ExampleBookSellerAPI:
//   - its own base URL (configurable via env var)
//   - its own mapper normalising its response shape into Book[]
//   - its own error handling
export class AnotherBookSellerAPI implements Provider {
  constructor(
    private readonly baseUrl: string = process.env.ANOTHER_BOOK_SELLER_BASE_URL ??
      "http://api.another-book-seller.com",
  ) {}

  async search(_query: BookSearchQuery): Promise<Book[]> {
    throw new Error("AnotherBookSellerAPI.search is not yet implemented");
  }
}
