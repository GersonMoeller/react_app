
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "../config/database"; 
import {Category} from './Category'; 

interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt?: Date;
  completedAt?: Date | null;
  userId: number;
  categoryId: number; 
  
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'createdAt'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public status!: 'pending' | 'in_progress' | 'completed';
  public completedAt?: Date | null;
  public userId!: number;
  public categoryId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Este campo pode ser nulo inicialmente
      },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    categoryId: { 
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories', 
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
  }
);

// Definindo a relação entre Task e Category
Task.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' }); // Adicione esta linha


export { Task,TaskCreationAttributes };
