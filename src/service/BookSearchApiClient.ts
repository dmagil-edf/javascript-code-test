import { z } from "zod";
import { Book } from "../domain/Book";
import { Provider } from "../providers/Provider";

const LimitSchema = z
  .number()
  .int("limit must be an integer")
  .positive("limit must be a positive integer");

function nonEmptyString(fieldName: string) {
  return z.string().trim().min(1, `${fieldName} must not be empty`);
}

const YearSchema = z
  .number()
  .int("year must be an integer")
  .positive("year must be a positive number");

export class BookSearchApiClient {
  constructor(private provider: Provider) {}

  searchByAuthor(author: string, limit: number): Promise<Book[]> {
    nonEmptyString("author").parse(author);
    LimitSchema.parse(limit);
    return this.provider.searchByAuthor(author, limit);
  }

  searchByPublisher(publisher: string, limit: number): Promise<Book[]> {
    nonEmptyString("publisher").parse(publisher);
    LimitSchema.parse(limit);
    return this.provider.searchByPublisher(publisher, limit);
  }

  searchByYear(year: number, limit: number): Promise<Book[]> {
    YearSchema.parse(year);
    LimitSchema.parse(limit);
    return this.provider.searchByYear(year, limit);
  }
}
