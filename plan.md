Requirements:

- needs to handle different formats JSON/ XML
- needs to have input validation
- should handle different HTTP responses

1. How could you easily add other book seller APIs in the the future

- Use a provider interface to allow for injection of any provider into the BookSearchApiClient

1. How would you manage differences in response payloads between different APIs without needing to make future changes to whatever code you have in example-client.js

- create mappers for each provider that will map responses into domain types

1. How would you implement different query types for example: by publisher, by year published etc

- manage it using teh query object and let each provider infer how to do it

1. How your code would be tested

- Unit tests mocking where required

Implementation plan:

1. ✅ Define domain types
2. ✅ Define interface for BookSearchApiClient and Provider
3. Build query param validation logic in BookSearchApiClient and test
4. Build Mapper for 1st provider and test
5. Build Provider including response handling and test
