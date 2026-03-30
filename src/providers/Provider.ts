import { Book } from "../domain/Book";
import { BookSearchQuery } from "../domain/BookSearchQuery";

export interface Provider {
  search: (query: BookSearchQuery) => Promise<Book[]>;
}
