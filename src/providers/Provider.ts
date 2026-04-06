import { Book } from "../domain/Book";

export interface Provider {
  searchByAuthor: (author: string, limit: number) => Promise<Book[]>;
  searchByPublisher: (publisher: string, limit: number) => Promise<Book[]>;
  searchByYear: (year: number, limit: number) => Promise<Book[]>;
}
