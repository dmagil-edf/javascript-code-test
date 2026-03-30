import { describe, expect, test, vi } from "vitest";

import { BookSearchApiClient } from "./BookSearchApiClient";

describe("BookSearchApiClient", () => {
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
    search: vi.fn().mockResolvedValue(books),
  };

  const client = new BookSearchApiClient(provider);

  test("delegates to provider with a valid author query", async () => {
    const query = { author: "William Shakespeare", limit: 10 };
    const result = await client.search(query);

    expect(provider.search).toHaveBeenCalledWith(query);
    expect(result).toEqual(books);
  });

  test("throws when no search fields are provided", () => {
    expect(() => client.search({ limit: 10 })).toThrow(
      "At least one search field must be provided"
    );
  });

  test("throws when limit is zero", () => {
    expect(() => client.search({ author: "Tolkien", limit: 0 })).toThrow(
      "limit must be a positive integer"
    );
  });

  test("throws when limit is negative", () => {
    expect(() => client.search({ author: "Tolkien", limit: -5 })).toThrow(
      "limit must be a positive integer"
    );
  });

  test("throws when limit is not an integer", () => {
    expect(() => client.search({ author: "Tolkien", limit: 1.5 })).toThrow(
      "limit must be a positive integer"
    );
  });

  test("accepts a query with publisher only", async () => {
    const query = { publisher: "Penguin", limit: 5 };
    await expect(client.search(query)).resolves.toEqual(books);
  });

  test("accepts a query with yearPublished only", async () => {
    const query = { yearPublished: 1603, limit: 5 };
    await expect(client.search(query)).resolves.toEqual(books);
  });

  test("accepts a query with isbn only", async () => {
    const query = { isbn: "9780141396507", limit: 5 };
    await expect(client.search(query)).resolves.toEqual(books);
  });
});
