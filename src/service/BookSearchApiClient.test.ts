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
    searchByAuthor: vi.fn().mockResolvedValue(books),
    searchByPublisher: vi.fn().mockResolvedValue(books),
    searchByYear: vi.fn().mockResolvedValue(books),
  };

  const client = new BookSearchApiClient(provider);

  test("delegates searchByAuthor to provider", async () => {
    const result = await client.searchByAuthor("William Shakespeare", 10);

    expect(provider.searchByAuthor).toHaveBeenCalledWith("William Shakespeare", 10);
    expect(result).toEqual(books);
  });

  test("throws when author is empty", () => {
    expect(() => client.searchByAuthor("", 10)).toThrow("author must not be empty");
  });

  test("throws when author is only whitespace", () => {
    expect(() => client.searchByAuthor("   ", 10)).toThrow("author must not be empty");
  });

  test("throws when limit is zero", () => {
    expect(() => client.searchByAuthor("Tolkien", 0)).toThrow("limit must be a positive integer");
  });

  test("throws when limit is negative", () => {
    expect(() => client.searchByAuthor("Tolkien", -5)).toThrow("limit must be a positive integer");
  });

  test("throws when limit is not an integer", () => {
    expect(() => client.searchByAuthor("Tolkien", 1.5)).toThrow("limit must be an integer");
  });

  test("delegates searchByPublisher to provider", async () => {
    const result = await client.searchByPublisher("Penguin", 5);

    expect(provider.searchByPublisher).toHaveBeenCalledWith("Penguin", 5);
    expect(result).toEqual(books);
  });

  test("throws when publisher is empty", () => {
    expect(() => client.searchByPublisher("", 10)).toThrow("publisher must not be empty");
  });

  test("delegates searchByYear to provider", async () => {
    const result = await client.searchByYear(1603, 5);

    expect(provider.searchByYear).toHaveBeenCalledWith(1603, 5);
    expect(result).toEqual(books);
  });

  test("throws when year is not a positive number", () => {
    expect(() => client.searchByYear(-1, 10)).toThrow("year must be a positive number");
  });

  test("throws when year is not an integer", () => {
    expect(() => client.searchByYear(16.5, 10)).toThrow("year must be an integer");
  });
});
