/**
 *Interface for the expected response body from the login API endpoint.
 */
export interface Category {
  id: number | null;
  name: string;
  userId: number | null;
}
