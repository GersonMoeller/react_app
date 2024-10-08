// src/routes/taskRoutes.ts
import express from 'express';
import { createTask,getTasks,createCtg } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/authMiddleware';
import {Task} from '../models/Task';
import {Category} from '../models/Category';

const router = express.Router();



// Rota para criar uma nova tarefa
router.get('/', authMiddleware, getTasks);
router.post('/create', authMiddleware, createTask); // O middleware de autenticação garante que o usuário esteja autenticado

router.post('/categories-create', authMiddleware, createCtg)

router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, categoryId } = req.body;

    // Inicializa completedAt como null
    let completedAt = null;

    // Se o status for 'completed', preencha completedAt com a data atual
    if (status === 'completed') {
        completedAt = new Date();
    } else {
        completedAt = null;
    }

    try {
        // Atualiza a tarefa
        const [updated] = await Task.update(
            {
                title,
                description,
                status,
                completedAt, // Atualiza completedAt
                categoryId,
            },
            {
                where: {
                    id: taskId,
                },
            }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Busca a tarefa atualizada e retorna
        const updatedTask = await Task.findByPk(taskId, { include: [{ model: Category, as: 'category' }] });

        return res.status(200).json(updatedTask); // Retorna a tarefa atualizada
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating task' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Tenta encontrar a tarefa pelo ID e excluí-la
        const task = await Task.findByPk(id);
        
        if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        await task.destroy();
        return res.status(204).send(); // Retorna 204 No Content
    } catch (error) {
        console.error('Erro ao deletar a tarefa:', error);
        return res.status(500).json({ message: 'Erro ao deletar a tarefa' });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar categorias.' });
    }
});



export default router;
