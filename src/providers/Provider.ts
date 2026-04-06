import { Book } from "../domain/Book";

export interface Provider {
  searchByAuthor: (author: string, limit: number) => Promise<Book[]>;
}
