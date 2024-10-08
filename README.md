# Meu Projeto

Este projeto é uma aplicação web desenvolvida com React e Express, utilizando Docker para facilitar o ambiente de desenvolvimento. A aplicação permite gerenciar tarefas e categorias.

## Pré-requisitos

Antes de começar, você precisa ter o seguinte instalado na sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [GIT](https://git-scm.com/book/ms/v2/Getting-Started-First-Time-Git-Setup)

## Configuração
1. **Faça o Clone do Código** 
   ```bash
      git clone https://github.com/GersonMoeller/react_app.git
      ```
1. **Crie um arquivo `.env` na Raiz do Projeto:**
   Certifique-se de que o arquivo `.env` esteja no diretório raiz do projeto, com as seguintes variáveis de ambiente:

   **Dados Fictícios**
   ```env
   # Chave para Geração de token JWT
   SECRET_KEY='ed5d0eb76e7c6ae9d927bd515d6fb9c4e8271942faeb00ae116ae9923569b3d3'

   # Variáveis do Banco de dados Postgres - INICIO

   # Usuário
   POSTGRES_USER='postgres'
   # Senha
   POSTGRES_PASSWORD='password'
   # Nome do Banco
   POSTGRES_DB='meu_banco'
   # Endereço do Banco pelo lado do Host (POSTGRES_EXT_PORT:5432)
   POSTGRES_EXT_PORT='5434'

   # Variáveis do Banco de dados Postgres - FIM

   # Porta para acessar a aplicação pela web
   NGINX_PORT='3002'


## Executando o Projeto

Para executar a aplicação, siga os passos abaixo:
1. **Acesse a Pasta Backend e Frontend** e rode
   ```bash 
      npm install
      ```
2. **Construa e inicie os containers:**
No diretório raiz do projeto, execute o seguinte comando:

```bash
docker-compose up --build -d

```
**Pronto ! Agora só acessar http://localhost:${NGINX_PORT}**