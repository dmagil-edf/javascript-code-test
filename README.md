# Javascript Code Test

`BookSearchApiClient` is a simple class that makes a call to a http API to retrieve a list of books and return them.

This repository is now bootstrapped as a TypeScript project.

## Commands

- `yarn start` runs the example TypeScript client directly with `tsx`
- `yarn check` typechecks the project without emitting output
- `yarn build` compiles TypeScript into `dist/`

## Structure

- `src/BookSearchApiClient.ts` contains the typed client API and search query model
- `src/ExampleBookSellerDataSource.ts` contains a concrete API-backed data source
- `src/example-client.ts` shows how to compose and run the client
