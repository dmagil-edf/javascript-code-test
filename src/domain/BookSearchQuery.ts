export type BookSearchQuery = {
  author?: string;
  publisher?: string;
  yearPublished?: number;
  isbn?: string;
  limit: number;
};
