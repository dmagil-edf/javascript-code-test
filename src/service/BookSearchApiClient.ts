import { Book } from "../domain/Book";
import { IBookSearchApiClient } from "../domain/BookSearchApiClient";
import { BookSearchQuery } from "../domain/BookSearchQuery";
import { Provider } from "../providers/Provider";

export class BookSearchApiClient implements IBookSearchApiClient {
  constructor(private provider: Provider) {}

  search(query: BookSearchQuery): Promise<Book[]> {
    this.validateQuery(query);
    return this.provider.search(query);
  }

  private validateQuery(query: BookSearchQuery): void {
    const { author, publisher, yearPublished, isbn, limit } = query;

    if (!author && !publisher && !yearPublished && !isbn) {
      throw new Error("At least one search field must be provided (author, publisher, yearPublished, or isbn)");
    }

    if (!Number.isInteger(limit) || limit <= 0) {
      throw new Error("limit must be a positive integer");
    }
  }
}
