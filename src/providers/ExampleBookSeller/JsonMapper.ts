import { z } from "zod";
import { Book } from "../../domain/Book";

export const RawExampleBookSellerBookSchema = z.object({
  book: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string(),
  }),
  stock: z.object({
    quantity: z.number(),
    price: z.number(),
  }),
});

export const RawExampleBookSellerBooksSchema = z.array(RawExampleBookSellerBookSchema);

export type RawExampleBookSellerBook = z.infer<typeof RawExampleBookSellerBookSchema>;

export function mapBook(raw: RawExampleBookSellerBook): Book {
  return {
    title: raw.book.title,
    author: raw.book.author,
    isbn: raw.book.isbn,
    quantity: raw.stock.quantity,
    price: raw.stock.price,
  };
}

export function mapBooks(raw: RawExampleBookSellerBook[]): Book[] {
  return raw.map(mapBook);
}
