/**
 *Interface for the expected response body from the login API endpoint.
 */
export interface Category {
  id: number;
  name: string;
  userId: number;
}

/*
 * Interface for creating a new category
 */
export interface CategoryCreate {
  name: string;
}
