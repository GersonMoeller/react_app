import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import styles from '../styles/Register.module.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        try {
            const response = await axiosInstance.post("/auth/register", {
                username,
                password,
            });
            setMessage("Registro bem-sucedido! Redirecionando para o login...");
            setTimeout(() => {
                navigate('/login'); // Redireciona para a página de login após 2 segundos
            }, 2000);
        } catch (error: any) {
            console.error('Erro na requisição:', error);
            setMessage("Erro ao registrar usuário");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerBox}>
                <div className={styles.avatar}>
                    <i className="fas fa-user-circle"></i>
                </div>
                <h2 className={styles.title}>Criar Conta</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.registerButton}>Registrar</button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default Register;
