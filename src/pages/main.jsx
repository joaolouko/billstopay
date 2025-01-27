import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/layout/Nav";
import Conta from "../components/Conta";
import styles from "./main.module.css"


function Main() {
    const [contas, setContas] = useState([]); // Estado para armazenar as contas
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Estado para erros

    // Função para buscar as contas
    useEffect(() => {
        const fetchContas = async () => {
            try {
                const response = await axios.get("http://localhost:3000/contas");
                setContas(response.data); // Atualiza o estado com os dados
            } catch (err) {
                setError(err.message); // Captura o erro, se ocorrer
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchContas();
    }, []); // Executa apenas uma vez, quando o componente monta

    if (loading) return <p>Carregando...</p>; // Exibe enquanto carrega
    if (error) return <p>Erro ao carregar contas: {error}</p>; // Exibe o erro, se houver

    return (
        <>
            <div>
                <Nav />
                <h1>Página principal</h1>
                {contas.length > 0 ? (
                    <div className="contas-list">
                        {contas.map((conta) => (
                            <Conta
                                key={conta.cod}
                                cod={conta.cod}
                                nome={conta.nome}
                                tipo={conta.tipo} // Nome do tipo
                                valor={conta.valor}
                                paga={conta.paga}
                            />
                        ))}
                    </div>
                ) : (
                    <p>Nenhuma conta encontrada!</p>
                )}
            </div>
        </>
    );
}

export default Main;
