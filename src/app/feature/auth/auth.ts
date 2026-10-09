

export type Role = 'student' | 'teacher';

export interface SignupRequest {
  email: string,
  password: string,
  data: {
    account_type: Role,
    first_name: string,
    last_name: string,
    avatar_url?: string
  }
}

export interface LoginRequest {
  email: string,
  password: string
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    user_metadata: {
      first_name: string;
      last_name: string;
      account_type: Role;
      avatar_url?: string;
    };
  };
}