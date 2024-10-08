import axios from 'axios';

// Criação da instância do axios
const axiosInstance = axios.create({
  baseURL: '/api',  
});

// Interceptor de requisição
axiosInstance.interceptors.request.use(
  (config) => {
    // Evita adicionar o token nas rotas de login e register
    if (config.url !== '/auth/login' && config.url !== '/auth/register') {
      const token = localStorage.getItem('token');
      if (token) {
        // Adiciona o token no cabeçalho Authorization
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
