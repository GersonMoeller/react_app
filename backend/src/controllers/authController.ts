import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Task, TaskCreationAttributes } from '../models/Task'; 
import { Category } from '../models/Category'; 
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Cria tarefas padrão para o usuário
const createDefaultTasks = async (rootUserId: number, categories: any) => {
  const defaultTasks: TaskCreationAttributes[] = [ 
    {
      title: 'Analisar Currículo',
      description: 'Verificar Qualificações',
      status: 'completed',
      userId: rootUserId,
      categoryId: categories[0].id,
      createdAt: new Date('2024-09-27'),
      completedAt: new Date('2024-09-30'),
    },
    {
      title: 'Entrevista',
      description: 'Entrevistar',
      status: 'completed',
      userId: rootUserId,
      categoryId: categories[1].id,
      createdAt: new Date('2024-10-02'),
      completedAt: new Date('2024-10-03'),
    },
    {
      title: 'Exercício',
      description: 'Atividade Prática',
      status: 'completed',
      userId: rootUserId,
      categoryId: categories[2].id,
      createdAt: new Date('2024-10-03'),
      completedAt: new Date('2024-10-07'),
    },
    {
      title: 'Análise do Exercício',
      description: 'Análise da Atividade Prática',
      status: 'in_progress',
      userId: rootUserId,
      categoryId: categories[2].id,
      createdAt: new Date('2024-10-07'),
      completedAt: null,
    },
    {
      title: 'Contratação',
      description: 'Contratar',
      status: 'pending',
      userId: rootUserId,
      categoryId: categories[2].id,
      createdAt: new Date('2024-10-07'),
      completedAt: null,
    },
  ];

  // Insere tarefas padrão para o User
  for (const task of defaultTasks) {
    await Task.create(task);
  }
};

// Método para login
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Credenciais inválidas" });
};

// Método para registro
export const register = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  console.log("Tentando registrar:", { username, password });

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
      return res.status(200).json({ message: "Usuário já existe" });
  }
  
  try {
    console.log("Iniciando hash da senha:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha hasheada com sucesso:", hashedPassword);
    const newUser = await User.create({ username, password: hashedPassword });
    
    const categories = await Category.findAll(); // Buscando todas as categorias

    if (newUser && categories.length > 0) {
      await createDefaultTasks(newUser.id, categories);
      console.log('Tarefas padrão criadas para o usuário root.');
    } else {
      console.error('Usuário root ou categorias não encontradas.');
    }
    return res.status(201).json({ message: "Usuário Registrado " + newUser.username + " !" });
  } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      return res.status(500).json({ message: "Erro ao registrar o usuário" });
  }
};

// Método para verificar o token JWT
export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY as string); // Verifica o token, se for válido, não lança erro
    return res.status(200).json({ message: 'Token válido.' });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
