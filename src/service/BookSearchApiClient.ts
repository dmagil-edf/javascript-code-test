import { Book } from "../domain/Book";
import { IBookSearchApiClient } from "../domain/BookSearchApiClient";
import { Provider } from "../providers/Provider";

export class BookSearchApiClient implements IBookSearchApiClient {
  constructor(private provider: Provider) {}

  getBooksByAuthor(authorName: string, limit: number): Promise<Book[]> {
    return this.provider.getBooksByAuthor(authorName, limit);
  }
}
