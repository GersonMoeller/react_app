import React, { useState } from 'react';
import { Category } from '../types';
import axiosInstance from '../axiosConfig';
import styles from '../styles/AddEditTaskModal.module.css';

interface AddCtgModalProps {
  onClose: () => void;
  onAddCtg: (newCtg: Category) => void;
}

const AddCtgModal: React.FC<AddCtgModalProps> = ({ onClose, onAddCtg }) => {
  const [name, setName] = useState('');

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.post('/tasks/categories-create', {
        name,
      });
  
      const newCategory: Category = response.data;
  
      onAddCtg(newCategory); // Adiciona a nova categoria
      setName(''); // Limpa o campo de entrada
      onClose(); // Fecha o modal
    } catch (error) {
      alert('Erro ao adicionar a categoria.');
    }
  };

  return (
    <div className={styles['modal-container']}>
      <div className={styles['modal-content']}>
        <h2 className={styles['modal-title']}>Adicionar Categoria</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Descrição"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className={styles['add-button']}>Adicionar</button>
        </form>
        <button onClick={onClose} className={styles['close-button']}>Fechar</button>
      </div>
    </div>
  );
};

export default AddCtgModal;
