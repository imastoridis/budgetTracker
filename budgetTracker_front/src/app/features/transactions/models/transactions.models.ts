import { TransactionType } from './transaction-types.enum';

/**
 *Interface for the expected response body from the login API endpoint.
 */
export interface Transaction {
  id: number | null;
  amount: number;
  description: string | '';
  type: TransactionType | null;
  date: Date;
  categoryId: number | null;
  userId: number | null;
}
