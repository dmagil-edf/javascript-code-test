import { Book } from "../domain/Book";

export interface Provider {
  getBooksByAuthor: (author: string, limit: number) => Promise<Book[]>;
}
