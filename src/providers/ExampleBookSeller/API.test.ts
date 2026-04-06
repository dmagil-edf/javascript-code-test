import { afterEach, describe, expect, test, vi } from "vitest";
import { ExampleBookSellerAPI } from "./API";
import { RawExampleBookSellerBook } from "./JsonMapper";

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

  describe("searchByAuthor", () => {
    test("fetches from /by-author and returns mapped books", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => rawBooks });

      const result = await provider.searchByAuthor("William Shakespeare", 10);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/by-author?q=William+Shakespeare&limit=10&format=json",
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

    test("throws on non-2xx HTTP response", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      await expect(provider.searchByAuthor("Shakespeare", 10)).rejects.toThrow(
        "ExampleBookSellerAPI request failed with status 404",
      );
    });

    test("propagates network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(provider.searchByAuthor("Shakespeare", 10)).rejects.toThrow("Network error");
    });

    test("throws when response shape is invalid", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ unexpected: "shape" }],
      });

      await expect(provider.searchByAuthor("Shakespeare", 10)).rejects.toThrow();
    });
  });

  describe("searchByPublisher", () => {
    test("fetches from /by-publisher with correct URL", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => rawBooks });

      await provider.searchByPublisher("Penguin", 5);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/by-publisher?q=Penguin&limit=5&format=json",
      );
    });
  });

  describe("searchByYear", () => {
    test("fetches from /by-year with correct URL", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => rawBooks });

      await provider.searchByYear(1603, 5);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/by-year?q=1603&limit=5&format=json",
      );
    });
  });

  describe("XML format", () => {
    const xmlProvider = new ExampleBookSellerAPI("http://test-api.example.com", "xml");
    const validXml = `
      <books>
        <item>
          <book><title>Hamlet</title><author>William Shakespeare</author><isbn>9780141396507</isbn></book>
          <stock><quantity>4</quantity><price>9.99</price></stock>
        </item>
      </books>`;

    test("requests xml format and returns mapped books", async () => {
      mockFetch.mockResolvedValue({ ok: true, text: async () => validXml });

      const result = await xmlProvider.searchByAuthor("Shakespeare", 5);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://test-api.example.com/by-author?q=Shakespeare&limit=5&format=xml",
      );
      expect(result).toContainEqual(
        expect.objectContaining({ title: "Hamlet", author: "William Shakespeare" }),
      );
    });

    test("throws on invalid XML response shape", async () => {
      mockFetch.mockResolvedValue({ ok: true, text: async () => "<unexpected/>" });

      await expect(xmlProvider.searchByAuthor("Shakespeare", 5)).rejects.toThrow();
    });
  });
});
