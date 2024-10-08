

import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Inclui o campo 'user' no objeto Request
    }
  }
}
