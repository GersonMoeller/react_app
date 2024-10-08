import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
import '../styles/taskTable.css';

const TaskTable = ({ tasks, onEdit, onDelete }) => {
  const [tableInitialized, setTableInitialized] = useState(false);

  // Função para traduzir status
  const translateStatus = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'Em andamento';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  useEffect(() => {
    // Inicializa a tabela DataTable
    if (!tableInitialized) {
      const table = $('#taskTable').DataTable({
        searching: true,
        paging: true,
        ordering: true,
        info: true,
        language: {
          search: "Pesquisar:",
          lengthMenu: "Mostrar _MENU_ tarefas",
          paginate: {
            next: "Próxima",
            previous: "Anterior",
          },
        },
      });

      // Filtros personalizados
      $('#statusFilter').on('change', function () {
        table.column(3).search(this.value).draw(); // Filtra a coluna Status (coluna 3)
      });

      $('#categoryFilter').on('change', function () {
        table.column(4).search(this.value).draw(); // Filtra a coluna Categoria (coluna 4)
      });

      // Filtro de data
      $('#dateFilterStart, #dateFilterEnd').on('change', function () {
        table.draw(); // Atualiza a tabela
    });
    
    // Função para comparar as datas das tarefas com o filtro
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      const minDateInput = $('#dateFilterStart').val();
      const maxDateInput = $('#dateFilterEnd').val();
    
      // Define minDate e maxDate corretamente, considerando o início e o fim do dia
      var minDate = minDateInput ? new Date(minDateInput).setHours(0, 0, 1, 500) : null; // 00:00:00
      var maxDate = maxDateInput ? new Date(maxDateInput).setHours(23, 59, 58, 900) : null; // 23:59:59
    
      // Adiciona um dia ao maxDate para que ele inclua tarefas do dia seguinte
      if (maxDate) {
          maxDate += 86400000; // Adiciona 1 dia em milissegundos
      }
      if (minDate) {
        minDate += 86400000; // Adiciona 1 dia em milissegundos
    }
    
      const taskDateStr = data[5]; // Data de Criação (coluna 5)
      console.log('Task Date String:', taskDateStr);
    
      // Converte a string da data para um formato que o construtor Date reconheça
      const [datePart, timePart] = taskDateStr.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
    
      // Cria a data da tarefa considerando hora, minuto e segundo
      const taskDate = new Date(year, month - 1, day, hours, minutes, seconds).getTime(); // .getTime() retorna o timestamp
    
      console.log(`Min Date: ${new Date(minDate)}, Max Date: ${new Date(maxDate)}, Task Date: ${new Date(taskDate)}`);
    
      // Condições de filtragem
      const isWithinMinDate = minDate === null || taskDate >= minDate;
      const isWithinMaxDate = maxDate === null || taskDate <= maxDate;
    
      // Certifique-se de que as datas estão sendo comparadas corretamente
      if (isWithinMinDate && isWithinMaxDate) {
          return true; // A tarefa está dentro do intervalo de datas
      }
      return false;
    });
      setTableInitialized(true);
    }

    return () => {
      // Destrói a tabela ao desmontar o componente
      if (tableInitialized) {
        $('#taskTable').DataTable().destroy();
        setTableInitialized(false);
      }
    };
  }, [tableInitialized]);

  const uniqueCategories = [...new Set(tasks
    .filter(task => task.category)
    .map(task => task.category.name))];

  useEffect(() => {
    if (tableInitialized) {
      const table = $('#taskTable').DataTable();
      // Limpa a tabela antes de adicionar as novas linhas
      table.clear();
      console.log(tasks);
      // Adiciona novas linhas
      tasks.forEach((task) => {
        table.row.add([
          task.id,
          task.title,
          task.description,
          translateStatus(task.status), // Usando a função de tradução aqui
          task.category ? task.category.name : 'N/A',
          new Date(task.createdAt).toLocaleDateString() + ' ' + new Date(task.createdAt).toLocaleTimeString(),
          task.completedAt ? new Date(task.completedAt).toLocaleDateString() + ' ' + new Date(task.completedAt).toLocaleTimeString() : 'N/A',
          `<button class='edit-btn'>Editar</button>
           <button class='delete-btn'>Deletar</button>`
        ]).draw();
      });

      // Lida com o evento de clique no botão de editar e deletar
      $('#taskTable tbody').off('click').on('click', 'button', function () {
        const action = $(this).hasClass('edit-btn') ? 'edit' : 'delete';
        const data = table.row($(this).parents('tr')).data();
        const taskId = data[0]; // O ID da tarefa

        if (action === 'edit') {
          handleEdit(tasks.find(task => task.id === taskId));
        } else if (action === 'delete') {
          handleDelete(taskId, $(this).parents('tr')); // Passa a linha também
        }
      });
    }
  }, [tasks, tableInitialized]);

  const handleEdit = (task) => {
    onEdit(task);
  };

  const handleDelete = (taskId, row) => {
    onDelete(taskId);
    // Remova a linha da tabela
    const table = $('#taskTable').DataTable();
    table.row(row).remove().draw();
  };

  return (
    <div className="table-container">
      <div className="filters">
        <label>Status: 
          <select id="statusFilter">
            <option value="">Todos</option>
            <option value="Concluída">Concluída</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Pendente">Pendente</option>
          </select>
        </label>
        <label>Categoria: 
          <select id="categoryFilter">
            <option value="">Todas</option>
            {uniqueCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>Data Início: 
          <input type="date" id="dateFilterStart" />
        </label>
        <label>Data Fim: 
          <input type="date" id="dateFilterEnd" />
        </label>
      </div>
      <table id="taskTable" className="display">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Status</th>
            <th>Categoria</th>
            <th>Data de Criação</th>
            <th>Data de Conclusão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* As linhas serão adicionadas via DataTables */}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
