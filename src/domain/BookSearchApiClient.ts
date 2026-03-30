import { Book } from "./Book";
import { BookSearchQuery } from "./BookSearchQuery";

export interface IBookSearchApiClient {
  search: (query: BookSearchQuery) => Promise<Book[]>;
}
