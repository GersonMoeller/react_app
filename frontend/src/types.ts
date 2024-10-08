// src/types.ts

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt?: Date;
  completedAt?: Date;
  userId: number;
  categoryId: number;
  category?: Category; // Adicione a referência da categoria
}
export interface Category {
  id: number; // ou string, dependendo de como você gerar os IDs
  name: string;
}