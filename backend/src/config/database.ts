import { Sequelize } from "sequelize";

// Configuração da conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('meu_banco', 'postgres', 'password', {
  host: 'postgres',
  dialect: 'postgres',
});

// Autenticação da conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  })
  .catch((error) => {
    console.error("Não foi possível conectar ao banco de dados:", error);
  });

export { sequelize };
