export interface User {
  id: string;
  username: string;
  email: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
}
