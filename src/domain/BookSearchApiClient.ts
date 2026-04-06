import { Book } from "./Book";

export interface IBookSearchApiClient {
  searchByAuthor: (author: string, limit: number) => Promise<Book[]>;
}
