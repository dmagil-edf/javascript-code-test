import { Book } from "../domain/Book";
import { BookSearchQuery } from "../domain/BookSearchQuery";
import { mapBooks, RawExampleBookSellerBooksSchema } from "./ExampleBookSellerJsonMapper";
import { mapBooksFromXml } from "./ExampleBookSellerXmlMapper";
import { Provider } from "./Provider";

type Format = "json" | "xml";

export class ExampleBookSellerAPI implements Provider {
  constructor(
    private readonly baseUrl: string = process.env.EXAMPLE_BOOK_SELLER_BASE_URL ??
      "http://api.book-seller-example.com",
    private readonly format: Format = "json",
  ) {}

  async search(query: BookSearchQuery): Promise<Book[]> {
    const url = this.buildUrl(query);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ExampleBookSellerAPI request failed with status ${response.status}`);
    }

    if (this.format === "xml") {
      const xml = await response.text();
      return mapBooksFromXml(xml);
    }

    const json = await response.json();
    const parsed = RawExampleBookSellerBooksSchema.parse(json);
    return mapBooks(parsed);
  }

  private buildUrl(query: BookSearchQuery): string {
    const params = new URLSearchParams();

    if (query.author) params.set("author", query.author);
    if (query.publisher) params.set("publisher", query.publisher);
    if (query.yearPublished) params.set("year", String(query.yearPublished));
    if (query.isbn) params.set("isbn", query.isbn);
    params.set("limit", String(query.limit));
    params.set("format", this.format);

    return `${this.baseUrl}/search?${params.toString()}`;
  }
}
