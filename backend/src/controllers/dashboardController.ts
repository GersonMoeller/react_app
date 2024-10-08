import { Request, Response } from "express";

export const getDashboardData = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;
  
  
    return res.status(401).json({ message: "Credenciais inválidas" });
  };