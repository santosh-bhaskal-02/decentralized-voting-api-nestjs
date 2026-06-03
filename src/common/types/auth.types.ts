import { Role } from '../enums/user.enum';

export interface JwtPayload {
  sub: string;
  role: Role;
  identifier?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface TokenResponse {
  accessToken: string;
  user: Record<string, any>;
  message: string;
}
