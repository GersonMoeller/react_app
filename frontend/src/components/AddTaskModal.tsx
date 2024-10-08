import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import axiosInstance from '../axiosConfig';
import { Category } from '../types';
import styles from '../styles/AddEditTaskModal.module.css';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/tasks/categories');
        setCategories(response.data);
      } catch (error) {
        alert('Erro ao buscar categorias.');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/tasks/create', {
        title,
        description,
        status,
        categoryId: selectedCategory,
      });

      onAddTask(response.data);
      setTitle('');
      setDescription('');
      setStatus('pending');
      setSelectedCategory(undefined);
      onClose();
    } catch (error) {
      alert('Erro ao adicionar a tarefa.');
    }
  };

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-content']}>
        <h2 className={styles['modal-title']}>Adicionar Tarefa</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label className={styles['label']} htmlFor="status-select">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'completed')}>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluída</option>
          </select>
          <label className={styles['label']} htmlFor="category-select">Categoria</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(Number(e.target.value))} required>
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className={styles['add-button']}>Adicionar</button>
        </form>
        <button onClick={onClose} className={styles['close-button']}>Fechar</button>
      </div>
    </div>
  );
};

export default AddTaskModal;
