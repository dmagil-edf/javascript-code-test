# BookSearchApiClient

A TypeScript client for querying book seller APIs, refactored to demonstrate the open-close principle, runtime response validation, and extensibility across multiple providers.

## Commands

- `yarn test` — runs all tests with Vitest
- `yarn check` — typechecks without emitting output
- `yarn build` — compiles TypeScript into `dist/`

## File Structure

```
src/
├── domain/
│   ├── Book.ts                                    # Shared Book type returned by all providers
│   ├── BookSearchQuery.ts                         # Query type (author, publisher, yearPublished, isbn, limit)
│   └── BookSearchApiClient.ts                     # IBookSearchApiClient interface
├── service/
│   └── BookSearchApiClient.ts                     # Validates queries, delegates to injected Provider
├── providers/
│   ├── Provider.ts                                # Interface all providers must implement
│   ├── ExampleBookSeller/
│   │   ├── API.ts                                 # Concrete provider: fetch, URL building, JSON/XML support
│   │   ├── JsonMapper.ts                          # Zod schema + mapping for JSON responses
│   │   └── XmlMapper.ts                           # Zod schema + mapping for XML responses
│   └── AnotherBookSeller/
│       └── API.ts                                 # Stub demonstrating how to add a second provider
└── example-client.ts                              # Composition root: wires provider → client → queries
```

## Configuration

| Environment Variable           | Default                              | Description                       |
| ------------------------------ | ------------------------------------ | --------------------------------- |
| `EXAMPLE_BOOK_SELLER_BASE_URL` | `http://api.book-seller-example.com` | Base URL for ExampleBookSellerAPI |
| `ANOTHER_BOOK_SELLER_BASE_URL` | `http://api.another-book-seller.com` | Base URL for AnotherBookSellerAPI |

Both can also be overridden by passing a value directly to the constructor, which is useful in tests:

```ts
const provider = new ExampleBookSellerAPI("http://localhost:3000");
```

## Questions

### How could you easily add other book seller APIs in the future?

Create a new folder under `src/providers/` (e.g. `AnotherBookSeller/`) and implement the `Provider` interface:

```ts
export interface Provider {
  search(query: BookSearchQuery): Promise<Book[]>;
}
```

See `src/providers/AnotherBookSeller/API.ts` for an example. Once implemented, inject the new provider into `BookSearchApiClient` at the composition root in `example-client.ts`. No existing code needs to change.

### How would you manage differences in response payloads between different APIs without needing to make future changes to `example-client.ts`?

Each provider folder owns its own mapper(s) (e.g. `JsonMapper.ts`, `XmlMapper.ts`). The mapper's job is to parse the raw API-specific payload and return the shared `Book` type. Every response is also validated against a [Zod](https://zod.dev) schema before mapping, so unexpected shapes are caught early with a clear error rather than propagating as `undefined` fields.

`example-client.ts` only ever works with `Book[]` — it has no knowledge of any provider's raw response shape. Adding a new provider with a completely different payload structure means writing a new mapper in that provider's folder; nothing in `example-client.ts` changes.

### How would you implement different query types — by publisher, by year published, etc.?

`BookSearchQuery` is a single object with optional fields:

```ts
export type BookSearchQuery = {
  author?: string;
  publisher?: string;
  yearPublished?: number;
  isbn?: string;
  limit: number;
};
```

Adding a new query type (e.g. `genre`) means adding one optional field here. `BookSearchApiClient` validates that at least one field is present but doesn't need to know which fields exist. Each provider's `buildUrl` method maps whichever fields are set to the appropriate URL parameters.

This is preferable to separate methods per query type (e.g. `searchByAuthor`, `searchByPublisher`) because the `IBookSearchApiClient` interface never needs to change — a new field on the type is sufficient.

### How would your code be tested?

Tests use [Vitest](https://vitest.dev/). Run with `yarn test`. No real network requests are made in any test.

- **`service/BookSearchApiClient.test.ts`** — unit tests for query validation (missing fields, invalid limit) and delegation to a mock provider passed via constructor injection
- **`providers/ExampleBookSeller/API.test.ts`** — unit tests for URL building, JSON and XML response paths, HTTP errors, network errors, and invalid response shapes; `fetch` is mocked via `vi.stubGlobal`
- **`providers/ExampleBookSeller/JsonMapper.test.ts`** — unit tests for valid data mapping and invalid shape rejection
- **`providers/ExampleBookSeller/XmlMapper.test.ts`** — unit tests for valid XML mapping and invalid XML rejection

`BookSearchApiClient` receives its `Provider` via constructor injection, so tests can pass a plain mock object without needing to mock imports or patch globals. The provider tests mock `fetch` directly via `vi.stubGlobal` — no DI container or HTTP client abstraction is required.

## Node Version

Requires Node ≥ 20 (specified in `.nvmrc` and `package.json` `engines` field). Node 20 is needed for the built-in `fetch` API.
