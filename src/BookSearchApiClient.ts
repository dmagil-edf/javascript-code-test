export interface Book {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  price: number;
}

export interface BookSearchQuery {
  author?: string;
  publisher?: string;
  publishedYear?: number;
  limit?: number;
}

export interface BookCatalogDataSource {
  search(query: BookSearchQuery): Promise<Book[]>;
}

export type BookSearchApiClient = {
  format: string;
  getBooksByAuthor(authorName: string, limit?: number): Book[];
};

export const BookSearchApiClient = function (
  this: BookSearchApiClient,
  format: string,
): void {
  this.format = format;
} as unknown as {
  new (format: string): BookSearchApiClient;
  prototype: BookSearchApiClient;
};

BookSearchApiClient.prototype.getBooksByAuthor = function (
  this: BookSearchApiClient,
  authorName: string,
  limit = 10,
): Book[] {
  let result: Book[] = [];

  if (typeof globalThis.XMLHttpRequest !== "function") {
    return result;
  }

  const xhr = new (
    globalThis as { XMLHttpRequest: new () => any }
  ).XMLHttpRequest();
  xhr.open(
    "GET",
    "http://api.book-seller-example.com/by-author?q=" +
      authorName +
      "&limit=" +
      limit +
      "&format=" +
      this.format,
  );

  xhr.onload = () => {
    if (xhr.status === 200) {
      if (this.format === "json") {
        const json = JSON.parse(xhr.responseText) as Array<{
          book: { title: string; author: string; isbn: string };
          stock: { quantity: number; price: number };
        }>;

        result = json.map((item) => ({
          title: item.book.title,
          author: item.book.author,
          isbn: item.book.isbn,
          quantity: item.stock.quantity,
          price: item.stock.price,
        }));
      } else if (this.format === "xml") {
        const xml = xhr.responseXML as any;

        result = (xml.documentElement.childNodes as any[]).map((item: any) => ({
          title: item.childNodes[0].childNodes[0].nodeValue,
          author: item.childNodes[0].childNodes[1].nodeValue,
          isbn: item.childNodes[0].childNodes[2].nodeValue,
          quantity: Number(item.childNodes[1].childNodes[0].nodeValue),
          price: Number(item.childNodes[1].childNodes[1].nodeValue),
        }));
      }
    }
  };

  xhr.send();

  return result;
};
