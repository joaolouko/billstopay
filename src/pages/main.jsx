import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/layout/Nav";
import Conta from "../components/Conta";
import styles from "./main.module.css";
import Select from "react-select";
import Swal from "sweetalert2";


function Main() {
    const [contas, setContas] = useState([]); // Contas retornadas da API
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [error, setError] = useState(null); // Erros ao carregar dados
    const [mes, setMes] = useState([]); // Meses retornados da API
    const [mesConta, setMesConta] = useState(null); // Mês selecionado
    const [ano, setAno] = useState([]); // Anos retornados da API
    const [anoConta, setAnoConta] = useState(""); // Ano selecionado

    
    //const endereco = 'IP do servidor'

    // Função para buscar contas
    const fetchContas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://${endereco}:3000/contas`);
            setContas(response.data); // Armazena todas as contas retornadas
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar meses
    const fetchMeses = async () => {
        try {
            const response = await axios.get(`http://${endereco}:3000/mes`);
            setMes(response.data); // Armazena os meses retornados
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAnos = async () => {
        try {
            const response = await axios.get(`http://${endereco}:3000/ano`);
            setAno(response.data); // Armazena os anos retornados
        } catch (err) {
            setError(err.message);
        }
    };

    // Carregar contas e meses ao montar o componente
    useEffect(() => {
        fetchContas();
        fetchMeses();
        fetchAnos();
    }, []);

    const excluirConta = async (cod) => {

        if (typeof cod !== 'string' && typeof cod !== 'number') {
            console.error('O cod não é válido', cod);
            return;
        }
        
        // Confirmação de exclusão
        const resultado = await Swal.fire({
            title: 'Tem certeza?',
            text: "Essa ação não pode ser desfeita.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (resultado.isConfirmed) {
            try {
                // Envia a requisição de exclusão para o backend
                await axios.delete(`http://${endereco}:3000/contas/${cod}`);
                Swal.fire('Conta excluída!', '', 'success');

                // Atualiza a lista de contas no estado removendo a conta excluída
                setContas((prevContas) => prevContas.filter(conta => conta.cod !== cod));
            } catch (error) {
                console.error("Erro ao excluir conta:", error.message);
                Swal.fire("Erro ao excluir a conta.", "", "error");
            }
        }
    };

    // Formatar os meses para o formato do react-select
    const mesesOptions = [
        { value: "", label: "Todos os meses" }, // Adiciona a opção "Todos os meses"
        ...mes.map((m) => ({
            value: m.cod, // Usar o código do mês para comparação
            label: m.descricao,
        })),
    ];

    const anosOptions = [
        { value: "", label: "Todos os anos" }, // Adiciona a opção "Todos os anos"
        ...ano.map((a) => ({
            value: a.cod, // Usar o código do ano para comparação
            label: a.descricao,
        })),
    ];

    // Filtrar contas com base no mês e ano selecionados
    const contasFiltradas = contas.filter((conta) => {
        const filtroMes = mesConta ? (mesConta.value === "" || conta.mes === mesConta.label) : true;
        const filtroAno = anoConta ? (anoConta.value === "" || conta.ano === anoConta.label) : true;
    
        return filtroMes && filtroAno;
    });
    

    if (loading) return <p>Carregando...</p>; // Exibe enquanto carrega
    if (error) return <p>Erro ao carregar dados: {error}</p>; // Exibe o erro, se houver

    return (
        <>
            <Nav />

            <div className={styles.selectBox}>
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
            </div>

            <div className={styles.contasList}>
                <h1>Bills To Pay</h1>
                {contasFiltradas.length > 0 ? (
                    <div className={styles.contasCard}>
                        {contasFiltradas.map((conta) => (
                            <Conta
                                key={conta.cod}
                                cod={conta.cod}
                                nome={conta.nome}
                                tipo={conta.tipo} // Tipo de conta
                                valor={conta.valor}
                                paga={conta.paga}
                                mes={conta.mes} // Mês da conta
                                ano={conta.ano}
                                excluirConta={excluirConta} // Passa a função de excluir
                            />
                        ))}
                    
                    </div>
                ) : (
                    <p>Nenhuma conta encontrada para o mês e ano selecionados!</p>
                )}
            </div>
        </>
    );
}

export default Main;
