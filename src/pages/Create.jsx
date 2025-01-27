import axios from "axios"
import Nav from "../components/layout/Nav";
import { useEffect, useState } from "react";
import styles from './Create.module.css'

function Create() {

    const [tipos, setTipos] = useState([]); // Armazena os dados retornados
    const [error, setError] = useState(null); // Armazena erros, se houver
    const [loading, setLoading] = useState(true); // Indica se está carregando

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/tipo');
                setTipos(response.data); // Atualiza o estado com os dados
            } catch (err) {
                setError(err.message); // Captura erros
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchData();
    }, []); // O array vazio [] garante que o efeito só será executado uma vez

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar dados: {error}</p>;
    return (
        <>
            <Nav />
            <div className={styles.container}>

                <h1>create</h1>

                {tipos.length > 0 ? (
                    <select>
                        {tipos.map((tipo) => (
                            <option key={tipo.cod}>{tipo.descricao}</option>
                        ))}
                    </select>
                ) : (
                    <p>Nenhum dado encontrado!</p>
                )}
            </div>
        </>
    )
}

export default Create