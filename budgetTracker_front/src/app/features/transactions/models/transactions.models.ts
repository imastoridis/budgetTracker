/**
 *Interface for the expected response body from the login API endpoint.
 */
export interface Transaction {
  id: number | null;
  amount: number;
  description: string | '';
  date: Date;
  categoryId: number | null;
}
