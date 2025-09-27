import { JwtPayload } from "jsonwebtoken";

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  iat?: number; // issued at (added by jwt)
  exp?: number; // expiry (added by jwt)
}

declare global{
    namespace Express {
        interface Request{
            admin?: AdminJwtPayload; //type depends on what you store in token
        }
    }
}