import axios from "axios"
import Nav from "../components/layout/Nav";
import { useEffect, useState } from "react";
import styles from './Create.module.css'
import Swal from "sweetalert2";
import Select from "react-select";
import { Button, Input } from "@mui/material";

const endereco = '192.168.1.106'

function Create() {

    const [nome, setNome] = useState("");
    const [valor, setValor] = useState(""); // Valor da conta
    const [tipoConta, setTipoConta] = useState(""); // Tipo de conta selecionado
    const [tipos, setTipos] = useState([]); // Armazena os dados retornados
    const [mesConta, setMesConta] = useState("")
    const [mes, setMes] = useState([])
    const [anoConta, setAnoConta] = useState("")
    const [ano, setAno] = useState([])
    const [error, setError] = useState(null); // Armazena erros, se houver
    const [loading, setLoading] = useState(true); // Indica se está carregando

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${endereco}:3000/tipo`);
                setTipos(response.data); // Atualiza o estado com os dados
            } catch (err) {
                setError(err.message); // Captura erros
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchData();
    }, []); // O array vazio [] garante que o efeito só será executado uma vez

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${endereco}:3000/mes`);
                setMes(response.data); // Atualiza o estado com os dados
            } catch (err) {
                setError(err.message); // Captura erros
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchData();
    }, []); // O array vazio [] garante que o efeito só será executado uma vez

    useEffect(() => {
        // Função para buscar os dados da API
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${endereco}:3000/ano`);
                setAno(response.data); // Atualiza o estado com os dados
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
            const response = await axios.post(`http://${endereco}:3000/contas`, {
                nome, // Nome da conta
                tipoConta: tipoConta?.value || "", // Tipo de conta selecionado
                valor,
                paga: false,
                mes: mesConta?.value || "", // Extrai o valor do mês selecionado
                ano: anoConta?.value || ""
            });

            Swal.fire('Conta Criada com sucesso') // Mensagem de sucesso
            setNome(""); // Limpa o campo de nome
            setValor("")
            setTipoConta(""); // Limpa o campo do tipo de conta
            setMesConta("");
            setMesConta("")
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Erro ao criar a conta",
                footer: "consulte o desenvolvedor"
            });
        }
    };

    const mesesOptions = [
        ...mes.map((m) => ({
            value: m.cod, // Usar o código do mês para comparação
            label: m.descricao,
        })),
    ];

    const anosOptions = [
        ...ano.map((a) => ({
            value: a.cod, // Usar o código do ano para comparação
            label: a.descricao,
        })),
    ];

    const tiposOptions = [
        ...tipos.map((t) => ({
            value: t.cod, // Usar o código do ano para comparação
            label: t.descricao,
        })),
    ];

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar dados: {error}</p>;
    return (
        <>
            <Nav />
            <div className={styles.container}>
                <div className={styles.box}>
                    <h1>Criar uma conta</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="nome">Nome da conta:</label>
                        <br />
                        <Input
                            type="text"
                            id="nome"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} // Atualiza o estado do nome
                            required
                        />
                        <br />

                        <label htmlFor="valor">Valor:</label>
                        <br />
                        <Input
                            type="number"
                            id="valor"
                            placeholder="Valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)} // Atualiza o estado do valor
                            required
                        />
                        <br />

                        <label htmlFor="tipo">Tipo de conta:</label>
                        <br />
                        {tipos.length > 0 ? (
                            <Select
                                id="tipo"
                                value={tipoConta}
                                onChange={setTipoConta} // Atualiza o estado do mês selecionado
                                options={tiposOptions} // Passa as opções no formato adequado para o react-select
                                placeholder="Selecione o tipo"
                            />
                        ) : (
                            <p>Carregando meses...</p>
                        )}
                        <br />

                        <label htmlFor="mes">Mês da conta:</label>
                        {mes.length > 0 ? (
                            <Select
                                id="mes"
                                value={mesConta}
                                onChange={setMesConta} // Atualiza o estado do mês selecionado
                                options={mesesOptions} // Passa as opções no formato adequado para o react-select
                                placeholder="Selecione o mês"
                            />
                        ) : (
                            <p>Carregando meses...</p>
                        )}
                        <br />
                        <label htmlFor="ano">Ano da conta:</label>
                        {ano.length > 0 ? (
                            <Select
                                id="ano"
                                value={anoConta}
                                onChange={setAnoConta} // Atualiza o estado do ano selecionado
                                options={anosOptions}
                                placeholder="Selecione o ano"
                            />
                        ) : (
                            <p>Carregando anos...</p>
                        )}
                        <br />
                        <Button type="submit">Enviar</Button>
                    </form>


                </div>

            </div>
        </>
    )
}

export default Create