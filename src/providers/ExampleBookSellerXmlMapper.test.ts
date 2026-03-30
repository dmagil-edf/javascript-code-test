import { describe, expect, test } from "vitest";
import { mapBooksFromXml } from "./ExampleBookSellerXmlMapper";

const validXml = `
<books>
  <item>
    <book>
      <title>Hamlet</title>
      <author>William Shakespeare</author>
      <isbn>9780141396507</isbn>
    </book>
    <stock>
      <quantity>4</quantity>
      <price>9.99</price>
    </stock>
  </item>
</books>
`;

describe("mapBooksFromXml", () => {
  test("parses a valid XML response into Books", () => {
    const result = mapBooksFromXml(validXml);

    expect(result).toHaveLength(1);
    expect(result).toContainEqual({
      title: "Hamlet",
      author: "William Shakespeare",
      isbn: "9780141396507",
      quantity: 4,
      price: 9.99,
    });
  });

  test("throws when XML does not match expected shape", () => {
    expect(() => mapBooksFromXml("<unexpected><data/></unexpected>")).toThrow();
  });
});
