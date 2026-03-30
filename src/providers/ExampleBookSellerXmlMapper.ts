import { XMLParser } from "fast-xml-parser";
import { z } from "zod";
import { mapBook } from "./ExampleBookSellerJsonMapper";
import { Book } from "../domain/Book";

// fast-xml-parser returns all tag values as strings when parseTagValue is false,
// so numeric fields need coercion.
const RawXmlBookSchema = z.object({
  book: z.object({
    title: z.string(),
    author: z.string(),
    isbn: z.string(),
  }),
  stock: z.object({
    quantity: z.coerce.number(),
    price: z.coerce.number(),
  }),
});

const RawXmlResponseSchema = z.object({
  books: z.object({
    item: z.array(RawXmlBookSchema),
  }),
});

const parser = new XMLParser({ isArray: (name) => name === "item", parseTagValue: false });

export function mapBooksFromXml(xmlString: string): Book[] {
  const raw = parser.parse(xmlString);
  const parsed = RawXmlResponseSchema.parse(raw);
  return parsed.books.item.map(mapBook);
}
