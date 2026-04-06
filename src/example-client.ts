import { ExampleBookSellerAPI } from "./providers/ExampleBookSeller/API";
import { BookSearchApiClient } from "./service/BookSearchApiClient";

const provider = new ExampleBookSellerAPI();
const client = new BookSearchApiClient(provider);

async function main() {
  const byAuthor = await client.searchByAuthor("Shakespeare", 5);
  console.log("By author:", byAuthor);
}

main().catch(console.error);
