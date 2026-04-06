import { Book } from "../../domain/Book";
import { Provider } from "../Provider";

// Demonstrates how another provider could be used with the client 
export class AnotherBookSellerAPI implements Provider {
  constructor(
    private readonly baseUrl: string = process.env.ANOTHER_BOOK_SELLER_BASE_URL ??
      "http://api.another-book-seller.com",
  ) {}

  async searchByAuthor(_author: string, _limit: number): Promise<Book[]> {
    throw new Error("Just for demoing. Could be extended");
  }
}
