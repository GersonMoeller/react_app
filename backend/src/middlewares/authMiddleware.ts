
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Verifica se o token existe

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
    if (err || !decoded) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = decoded; // Armazena o token decodificado no req.user
    next(); // Continua para o próximo middleware
  });
};
