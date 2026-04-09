import { Book } from "../domain/Book";

export const Format = {
  JSON: "json",
  XML: "xml",
} as const;

export type Format = (typeof Format)[keyof typeof Format];

export interface Provider {
  searchByAuthor: (author: string, limit: number) => Promise<Book[]>;
  searchByPublisher: (publisher: string, limit: number) => Promise<Book[]>;
  searchByYear: (year: number, limit: number) => Promise<Book[]>;
}
