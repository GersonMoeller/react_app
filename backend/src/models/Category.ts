import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database'; 

interface CategoryAttributes {
  id: number;
  name: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Para garantir que não haja categorias duplicadas
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories', 
  }
);


export { Category };