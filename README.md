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
├── service/
│   └── BookSearchApiClient.ts                     # Validates input with Zod, delegates to injected Provider
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
  searchByAuthor: (author: string, limit: number) => Promise<Book[]>;
}
```

See `src/providers/AnotherBookSeller/API.ts` for an example. Once implemented, inject the new provider into `BookSearchApiClient` at the composition root in `example-client.ts`. No existing code needs to change.

### How would you manage differences in response payloads between different APIs without needing to make future changes to `example-client.ts`?

Each provider folder owns its own mapper(s) (e.g. `JsonMapper.ts`, `XmlMapper.ts`). The mapper's job is to parse the raw API-specific payload and return the shared `Book` type. Every response is also validated against a [Zod](https://zod.dev) schema before mapping, so unexpected shapes are caught early with a clear error rather than propagating as `undefined` fields.

`example-client.ts` only ever works with `Book[]` — it has no knowledge of any provider's raw response shape. Adding a new provider with a completely different payload structure means writing a new mapper in that provider's folder; nothing in `example-client.ts` changes.

### How would you implement different query types — by publisher, by year published, etc.?

Each query type is an explicit method on the `Provider` interface (e.g. `searchByAuthor`, `searchByPublisher`). This design maps directly to how the underlying APIs work — each has a dedicated endpoint (`/by-author`, `/by-publisher`, etc.) rather than a single combined search endpoint.

Explicit methods were chosen because:

- **No ambiguity** — the caller states exactly which search type they want
- **Honest API modelling** — the provider interface reflects the real API surface
- **Type safety** — each method has strongly typed parameters (e.g. `year: number` vs `author: string`), so invalid combinations are caught at compile time

Adding a new query type means adding a method to the `Provider` interface and implementing it in each provider. The compiler ensures every provider is updated.

### How your code would be tested

Input validation and API response handling are tested independently:

- **Service layer tests** — use a mocked provider to verify input validation (empty author, invalid limit) and correct delegation without making network calls
- **Provider tests** — stub `fetch` globally to test URL construction, HTTP error handling, network failures, and response shape validation
- **Mapper tests** — unit test the JSON and XML mappers directly to verify correct transformation from raw API shapes to the shared `Book` type

[Zod](https://zod.dev) is used for validation at both boundaries — inputs are validated in the service layer before reaching the provider, and API responses are validated in the mappers before being returned to the caller. This ensures bad data is caught early with clear errors at every entry and exit point.
