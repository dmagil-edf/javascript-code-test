import { ExampleBookSellerAPI } from "./providers/ExampleBookSellerAPI";
import { BookSearchApiClient } from "./service/BookSearchApiClient";

const provider = new ExampleBookSellerAPI();
const client = new BookSearchApiClient(provider);

async function main() {
  const byAuthor = await client.search({ author: "Shakespeare", limit: 5 });
  console.log("By author:", byAuthor);

  const byPublisher = await client.search({ publisher: "Penguin", limit: 10 });
  console.log("By publisher:", byPublisher);

  const byYear = await client.search({ yearPublished: 1603, limit: 3 });
  console.log("By year:", byYear);
}

main().catch(console.error);
