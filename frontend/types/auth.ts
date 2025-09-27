// types/auth.ts

export interface Admin {
  _id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null; 
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  admin: null,
  token: null,
  loading: false,
  error: null,
  fieldErrors: null, 
};
