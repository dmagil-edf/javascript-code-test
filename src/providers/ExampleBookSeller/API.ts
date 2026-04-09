import { Book } from "../../domain/Book";
import { mapBooks, RawExampleBookSellerBooksSchema } from "./JsonMapper";
import { mapBooksFromXml } from "./XmlMapper";
import { Format, Provider } from "../Provider";

const ENDPOINTS = {
  byAuthor: "by-author",
  byPublisher: "by-publisher",
  byYear: "by-year",
} as const;

export class ExampleBookSellerAPI implements Provider {
  constructor(
    private readonly baseUrl: string = process.env.EXAMPLE_BOOK_SELLER_BASE_URL ??
      "http://api.book-seller-example.com",
    private readonly format: Format = Format.JSON,
  ) {}

  searchByAuthor(author: string, limit: number): Promise<Book[]> {
    return this.fetchBooks(ENDPOINTS.byAuthor, author, limit);
  }

  searchByPublisher(publisher: string, limit: number): Promise<Book[]> {
    return this.fetchBooks(ENDPOINTS.byPublisher, publisher, limit);
  }

  searchByYear(year: number, limit: number): Promise<Book[]> {
    return this.fetchBooks(ENDPOINTS.byYear, String(year), limit);
  }

  private async fetchBooks(endpoint: string, query: string, limit: number): Promise<Book[]> {
    const params = new URLSearchParams({ q: query, limit: String(limit), format: this.format });
    const url = `${this.baseUrl}/${endpoint}?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ExampleBookSellerAPI request failed with status ${response.status}`);
    }

    if (this.format === Format.XML) {
      const xml = await response.text();
      return mapBooksFromXml(xml);
    }

    const json = await response.json();
    const parsed = RawExampleBookSellerBooksSchema.parse(json);
    return mapBooks(parsed);
  }
}
