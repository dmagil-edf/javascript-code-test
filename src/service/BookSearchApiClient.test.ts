import { expect, test, vi } from "vitest";

import { BookSearchApiClient } from "./BookSearchApiClient";

test("calls the provider getBooksByAuthor function", async () => {
  const books = [
    {
      title: "Hamlet",
      author: "William Shakespeare",
      isbn: "9780141396507",
      quantity: 4,
      price: 9.99,
    },
  ];
  const provider = {
    getBooksByAuthor: vi.fn().mockResolvedValue(books),
  };
  const client = new BookSearchApiClient(provider);

  const result = await client.getBooksByAuthor("William Shakespeare", 10);

  expect(provider.getBooksByAuthor).toHaveBeenCalledWith("William Shakespeare", 10);
  expect(result).toEqual(books);
});
