// src/controllers/taskController.ts
import { Request, Response } from 'express';
import { Task } from '../models/Task'; 
import { Category } from '../models/Category';

// Método para obter as tarefas do usuário autenticado
export const getTasks = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req.user as any)?.id; // Pega o ID do usuário do middleware de autenticação

    const tasks = await Task.findAll<Task>({
      where: { userId },
      include: [{
        model: Category,
        as: 'category', // Use o alias definido na associação
        attributes: ['name'],
      }],
    });

    return res.status(200).json(tasks); // Retorna as tarefas em formato JSON
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return res.status(500).json({ message: 'Erro ao carregar tarefas.' });
  }
};

// Método para criar uma nova tarefa
export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, categoryId } = req.body;
    const userId = (req.user as any)?.id; // Usa o ID do usuário do middleware de autenticação
  
    try {
      // Cria a nova tarefa
      const newTask = await Task.create({
        title,
        description,
        status,
        userId,
        categoryId,
      });
  
      // Busca a categoria associada
      const category = await Category.findByPk(categoryId);
  
      // Retorna a tarefa criada junto com a categoria
      return res.status(201).json({
        ...newTask.toJSON(),
        category, // Inclui o objeto da categoria com o nome
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar a tarefa.' });
    }
};

// Método para criar uma nova categoria
export const createCtg = async (req: Request, res: Response) => {
    const { name } = req.body;
    
    try {
      // Cria a nova categoria
      const newCtg = await Category.create({
        name
      });
  
      // Retorna a categoria criada
      return res.status(201).json({
        ...newCtg.toJSON()
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar a categoria.' });
    }
};
