import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import TaskTable from './TaskTable';
import Graficos from './Graficos';
import AddTaskModal from '../components/AddTaskModal';
import AddCtgModal from '../components/AddCtgModal';
import EditTaskModal from '../components/EditTaskModal';
import styles from '../styles/Dashboard.module.css'; 
import { Category } from '../types';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [ctgs, setCategories] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddModalCtg, setShowAddModalCtg] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any | null>(null);

  // Função para buscar tarefas
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas', error);
    }
  };

  // Função para adicionar tarefa
  const handleAddTask = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAddCtg = (newCtg: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCtg]);
  };

  // Função para deletar tarefa
  const handleDeleteTask = async (id: number) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar a tarefa:', error);
    }
  };

  // Função para editar tarefa
  const handleEditTask = async (updatedTask: any) => {
    try {
      const response = await axiosInstance.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? response.data : task))
      );
    } catch (error) {
      console.error('Erro ao editar a tarefa:', error);
    }
  };

  // Função para abrir o modal de edição
  const handleOpenEditModal = (task: any) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Tarefas</div>
        <nav>
          <ul>
            <li className={styles.active}>Dashboard</li>
            
          </ul>
        </nav>
      </aside>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
          <input type="search" placeholder="Search..." className={styles.searchInput} />
          <div className={styles.userProfile}>Usúario</div>
        </header>
        
        <button className={styles.addButtonCtg} onClick={() => setShowAddModalCtg(true)}>
          Cadastrar Categoria
        </button>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          Adicionar Tarefa
        </button>

        <div className={styles.dashboardSection}>
          {/* Tabela de tarefas */}
          <TaskTable tasks={tasks} onDelete={handleDeleteTask} onEdit={handleOpenEditModal} />

          {/* Modal para adicionar tarefa */}
          {showAddModal && (
            <AddTaskModal onAddTask={handleAddTask} onClose={() => setShowAddModal(false)} />
          )}
          {showAddModalCtg && (
            <AddCtgModal onAddCtg={handleAddCtg} onClose={() => setShowAddModalCtg(false)} />
          )}

          {/* Modal para editar tarefa */}
          {showEditModal && taskToEdit && (
            <EditTaskModal
              task={taskToEdit}
              onEditTask={handleEditTask}
              onClose={() => setShowEditModal(false)}
            />
          )}
        </div>

        <div className={styles.dashboardSection}>
          {/* Gráficos */}
          <Graficos tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
