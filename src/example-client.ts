import { ExampleBookSellerAPI } from "./providers/ExampleBookSeller/API";
import { BookSearchApiClient } from "./service/BookSearchApiClient";

const provider = new ExampleBookSellerAPI();
const client = new BookSearchApiClient(provider);

async function main() {
  const byAuthor = await client.searchByAuthor("Shakespeare", 5);
  console.log("By author:", byAuthor);

  const byPublisher = await client.searchByPublisher("Penguin", 10);
  console.log("By publisher:", byPublisher);

  const byYear = await client.searchByYear(1603, 3);
  console.log("By year:", byYear);
}

main().catch(console.error);
