/**
 * Interface for the expected response body from the login API endpoint.
 */
export interface AuthResponse {
  id: string;
  name: string;
  user_id: string;
}
