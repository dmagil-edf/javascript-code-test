import { describe, expect, test } from "vitest";
import { mapBook, mapBooks, RawExampleBookSellerBook } from "./ExampleBookSellerJsonMapper";

const rawBook1: RawExampleBookSellerBook = {
  book: {
    title: "Hamlet",
    author: "William Shakespeare",
    isbn: "9780141396507",
  },
  stock: {
    quantity: 4,
    price: 9.99,
  },
};

describe("mapBook", () => {
  test("maps raw API fields to Book domain type", () => {
    expect(mapBook(rawBook1)).toEqual({
      title: "Hamlet",
      author: "William Shakespeare",
      isbn: "9780141396507",
      quantity: 4,
      price: 9.99,
    });
  });
});

describe("mapBooks", () => {
  test("maps an array of raw books", () => {
    const second: RawExampleBookSellerBook = {
      book: { title: "Othello", author: "William Shakespeare", isbn: "9780141396506" },
      stock: { quantity: 2, price: 7.99 },
    };

    const result = mapBooks([rawBook1, second]);

    expect(result).toHaveLength(2);
    expect(result.find((b) => b.title === "Hamlet")).toBeDefined();
    expect(result.find((b) => b.title === "Othello")).toBeDefined();
  });

  test("returns an empty array when given an empty array", () => {
    expect(mapBooks([])).toEqual([]);
  });
});
