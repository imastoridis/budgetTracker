/**
 * Interface for the data sent to the login API endpoint.
 * Ensures strict typing for the login request body.
 */
export interface Credentials {
  username: string;
  password: string;
}

/**
 * Interface for the expected response body from the login API endpoint.
 * This structure assumes a successful login returns a JWT token.
 */
export interface AuthResponse {
  // The JSON Web Token (JWT) string returned by the server.
  token: string;
}

/**
 * Interface for an API error response body
 */
export interface ApiError {
  status: number;
  message: string;
}
