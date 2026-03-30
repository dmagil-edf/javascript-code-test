import { Book } from "./Book";

export interface IBookSearchApiClient {
  getBooksByAuthor: (authorName: string, limit: number) => Promise<Book[]>;
}
