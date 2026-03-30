import { Book } from "../domain/Book";

export type RawExampleBookSellerBook = {
  book: {
    title: string;
    author: string;
    isbn: string;
  };
  stock: {
    quantity: number;
    price: number;
  };
};

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
