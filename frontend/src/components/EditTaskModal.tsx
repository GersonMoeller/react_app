import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Category } from '../types';
import styles from '../styles/AddEditTaskModal.module.css';

interface EditTaskModalProps {
  task: any; // Tarefa a ser editada
  onEditTask: (updatedTask: any) => void; // Função para enviar a tarefa editada
  onClose: () => void; // Fecha o modal
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onEditTask, onClose }) => {
  const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [categories, setCategories] = useState<Category[]>([]); // Estado para categorias
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(task.categoryId);
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

  const handleSave = () => {
    const updatedTask = { ...task, title, description, status, categoryId: selectedCategory };
    onEditTask(updatedTask); // Envia a tarefa editada para o pai (Dashboard)
    onClose(); // Fecha o modal após salvar
  };

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-content']}>
        <h2 className={styles['modal-title']}>Editar Tarefa</h2>
        <form onSubmit={handleSave}>
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
          <button type="submit" className={styles['add-button']}>Salvar</button>
        </form>
        <button onClick={onClose} className={styles['close-button']}>Fechar</button>
      </div>
    </div>
  );
};

export default EditTaskModal;
