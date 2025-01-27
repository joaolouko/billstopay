import axios from "axios"
import Nav from "../components/layout/Nav";
import { useEffect, useState } from "react";
import styles from './Create.module.css'

function Create() {

    const [nome, setNome] = useState("");
    const [valor, setValor] = useState(""); // Valor da conta
    const [tipoConta, setTipoConta] = useState(""); // Tipo de conta selecionado
    const [tipos, setTipos] = useState([]); // Armazena os dados retornados
    const [error, setError] = useState(null); // Armazena erros, se houver
    const [loading, setLoading] = useState(true); // Indica se está carregando
    const [message, setMessage] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o reload da página

        try {
            // Enviando os dados para o backend
            const response = await axios.post("http://localhost:3000/contas", {
                nome, // Nome da conta
                tipoConta, // Tipo de conta selecionado
                valor,
                paga: false
            });

            setMessage("Conta criada com sucesso!"); // Mensagem de sucesso
            setNome(""); // Limpa o campo de nome
            setValor("")
            setTipoConta(""); // Limpa o campo do tipo de conta
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            setMessage("Erro ao criar conta."); // Mensagem de erro
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar dados: {error}</p>;
    return (
        <>
            <Nav />
            <div className={styles.container}>
                <div className={styles.box}>
                    <h1>Criar uma conta</h1>
                    {message && <p>{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nome">Nome da conta:</label>
                        <input
                            type="text"
                            id="nome"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} // Atualiza o estado do nome
                            required
                        />
                        <br />

                        <label htmlFor="valor">Valor:</label>
                        <input
                            type="number"
                            id="valor"
                            placeholder="Valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)} // Atualiza o estado do valor
                            required
                        />
                        <br />
                        <label htmlFor="tipo">Tipo de conta:</label>
                        {tipos.length > 0 ? (
                            <select
                                id="tipo"
                                value={tipoConta}
                                onChange={(e) => setTipoConta(e.target.value)} // Atualiza o estado do tipoConta
                                required
                            >
                                <option value="" disabled>
                                    Selecione um tipo
                                </option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.cod} value={tipo.cod}>
                                        {tipo.descricao}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>Carregando tipos de conta...</p>
                        )}
                        <br />
                        <button type="submit">Enviar</button>
                    </form>


                </div>

            </div>
        </>
    )
}

export default Create