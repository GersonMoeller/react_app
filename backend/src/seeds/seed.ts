// src/seeders/seed.ts
import { sequelize } from '../config/database';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Category } from '../models/Category';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  // Inicie uma transação
  const t = await sequelize.transaction();

  try {
    await sequelize.sync();
    console.log('Database synced!');
    // Crie categorias
    const existingCategories = await Category.findAll();
    var categories = existingCategories;
    if (existingCategories.length === 0) {
      categories = await Category.bulkCreate([
        { name: 'Categoria 1' },
        { name: 'Categoria 2' },
        { name: 'Categoria 3' }
      ], { transaction: t });
    } else {
      console.log('Categorias já existem, pulando a criação.');
    }

    
    await t.commit();
    console.log('Banco de dados populado com dados iniciais.');
  } catch (error) {
    await t.rollback();
    console.error('Erro ao popular o banco de dados:', error);
  }
};

// Executa o seeder
seedDatabase()
  .then(() => {
    console.log('Seeding completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
