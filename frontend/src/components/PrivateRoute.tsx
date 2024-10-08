import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Faz uma requisição para o backend para validar o token
        const response = await axiosInstance.get('/auth/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro na verificação do token:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Verificando autenticação...</div>; // Mostrar um carregamento enquanto verifica
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redireciona para o login se o token for inválido ou ausente
  }

  return children; // Renderiza o componente protegido se o token for válido
};

export default PrivateRoute;
