import { Book } from "../../domain/Book";
import { mapBooks, RawExampleBookSellerBooksSchema } from "./JsonMapper";
import { mapBooksFromXml } from "./XmlMapper";
import { Provider } from "../Provider";

type Format = "json" | "xml";

export class ExampleBookSellerAPI implements Provider {
  constructor(
    private readonly baseUrl: string = process.env.EXAMPLE_BOOK_SELLER_BASE_URL ??
      "http://api.book-seller-example.com",
    private readonly format: Format = "json",
  ) {}

  async searchByAuthor(author: string, limit: number): Promise<Book[]> {
    const params = new URLSearchParams({ q: author, limit: String(limit), format: this.format });
    const url = `${this.baseUrl}/by-author?${params}`;
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
}
