import { afterEach, describe, expect, test, vi } from "vitest";
import { ExampleBookSellerAPI } from "./ExampleBookSellerAPI";
import { RawExampleBookSellerBook } from "./ExampleBookSellerJsonMapper";

const rawBooks: RawExampleBookSellerBook[] = [
  {
    book: { title: "Hamlet", author: "William Shakespeare", isbn: "9780141396507" },
    stock: { quantity: 4, price: 9.99 },
  },
];

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

afterEach(() => {
  mockFetch.mockReset();
});

describe("ExampleBookSellerAPI", () => {
  const provider = new ExampleBookSellerAPI("http://test-api.example.com");

  describe("search", () => {
    test("fetches by author and returns mapped books", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => rawBooks,
      });

      const result = await provider.search({ author: "William Shakespeare", limit: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/search?author=William+Shakespeare&limit=10&format=json",
      );
      expect(result).toEqual([
        {
          title: "Hamlet",
          author: "William Shakespeare",
          isbn: "9780141396507",
          quantity: 4,
          price: 9.99,
        },
      ]);
    });

    test("fetches by publisher and builds correct URL", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await provider.search({ publisher: "Penguin", limit: 5 });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/search?publisher=Penguin&limit=5&format=json",
      );
    });

    test("fetches by yearPublished and builds correct URL", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await provider.search({ yearPublished: 1603, limit: 5 });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/search?year=1603&limit=5&format=json",
      );
    });

    test("throws on non-2xx HTTP response", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      await expect(provider.search({ author: "Shakespeare", limit: 10 })).rejects.toThrow(
        "ExampleBookSellerAPI request failed with status 404",
      );
    });

    test("propagates network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(provider.search({ author: "Shakespeare", limit: 10 })).rejects.toThrow(
        "Network error",
      );
    });

    test("throws when response shape is invalid", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ unexpected: "shape" }],
      });

      await expect(provider.search({ author: "Shakespeare", limit: 10 })).rejects.toThrow();
    });
  });
});
