import { z } from "zod";
import { Book } from "../domain/Book";
import { IBookSearchApiClient } from "../domain/BookSearchApiClient";
import { Provider } from "../providers/Provider";

const SearchByAuthorSchema = z.object({
  author: z.string().trim().min(1, "author must not be empty"),
  limit: z.number().int("limit must be an integer").positive("limit must be a positive integer"),
});

export class BookSearchApiClient implements IBookSearchApiClient {
  constructor(private provider: Provider) {}

  searchByAuthor(author: string, limit: number): Promise<Book[]> {
    SearchByAuthorSchema.parse({ author, limit });
    return this.provider.searchByAuthor(author, limit);
  }
}
