import { BookSearchApiClient } from "./BookSearchApiClient";

const client = new BookSearchApiClient("json");
const booksByShakespeare = client.getBooksByAuthor("Shakespeare", 10);

console.log(booksByShakespeare);
