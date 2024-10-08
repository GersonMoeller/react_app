import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import styles from '../styles/Graficos.module.css';

interface Category {
  name: string;
}

interface Task {
  category: Category;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt: string | null;
}

interface GraficosProps {
  tasks: Task[];
}

const Graficos: React.FC<GraficosProps> = ({ tasks }) => {
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{
      label: 'Tarefas por Categoria',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  });

  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: [{
      label: 'Tarefas por Status',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  });

  const [completedTasksData, setCompletedTasksData] = useState({
    labels: [],
    datasets: [{
      label: 'Tarefas Concluídas (Últimos 7 dias)',
      data: [],
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      fill: false,
      tension: 0.4,
    }],
  });

  useEffect(() => {
    const categoriesCount: { [key: string]: number } = {};
    const statusCount: { [key: string]: number } = {
      pending: 0,
      in_progress: 0,
      completed: 0,
    };
    const completedTasksLast7Days: { [key: string]: number } = {};

    tasks.forEach((task) => {
      const categoryName = task.category ? task.category.name : 'N/A';
      categoriesCount[categoryName] = (categoriesCount[categoryName] || 0) + 1;

      if (task.status) {
        statusCount[task.status] += 1;
      }

      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const today = new Date();
        const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

        if (completedDate >= sevenDaysAgo) {
          const dateString = completedDate.toISOString().split('T')[0];
          completedTasksLast7Days[dateString] = (completedTasksLast7Days[dateString] || 0) + 1;
        }
      }
    });

    setCategoryData({
      labels: Object.keys(categoriesCount),
      datasets: [{
        label: 'Tarefas por Categoria',
        data: Object.values(categoriesCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    });

    setStatusData({
      labels: ['Pendente', 'Em andamento', 'Concluída'],
      datasets: [{
        label: 'Tarefas por Status',
        data: Object.values(statusCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: '#fff',
        borderWidth: 2,
      }],
    });

    const completedDaysLabels = Object.keys(completedTasksLast7Days);
    setCompletedTasksData({
      labels: completedDaysLabels,
      datasets: [{
        label: 'Tarefas Concluídas (Últimos 7 dias)',
        data: completedDaysLabels.map(date => completedTasksLast7Days[date]),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        fill: false,
        tension: 0.4,
      }],
    });
  }, [tasks]);

  return (
    <div className={styles['grid-container']}>
      <div className={styles['chart-item']}>
        <h3>Tarefas Por Categoria</h3>
        <Doughnut data={categoryData} />
      </div>
      <div className={styles['chart-item']}>
        <h3>Tarefas por Status</h3>
        <Doughnut data={statusData} />
      </div>
      <div className={styles['chart-item']}>
        <h3>Tarefas Concluídas nos Últ. 7 Dias</h3>
        <Line data={completedTasksData} height={100} width={100} />
      </div>
    </div>
  );
};

export default Graficos;
