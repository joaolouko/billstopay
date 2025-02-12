import { useEffect, useState } from "react";
import axios from "axios";
import styles from './Conta.module.css'
import Swal from "sweetalert2";
import Select from "react-select";
import { Button } from "@mui/material";



function Conta({ cod, nome, tipo, mes, ano, valor, paga: inicialPaga, excluirConta }) {
    const [paga, setPaga] = useState(inicialPaga);
    const [modalAberto, setModalAberto] = useState(false); // Estado do modal
    const [contaEditada, setContaEditada] = useState({ nome, tipo, mes, ano, valor });

    const [anos, setAnos] = useState(null);
    const [meses, setMeses] = useState(null);
    const [tipos, setTipos] = useState(null);


    
    //const endereco = 'IP do servidor'

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [anosRes, mesesRes, tiposRes] = await Promise.all([
                    axios.get(`http://${endereco}:3000/ano`),
                    axios.get(`http://${endereco}:3000/mes`),
                    axios.get(`http://${endereco}:3000/tipo`)
                ]);
                setAnos(anosRes.data);
                setMeses(mesesRes.data);
                setTipos(tiposRes.data);
            } catch (error) {
                console.error("Erro ao carregar opções do banco:", error.message);
            }
        };

        carregarOpcoes();
    }, []);

    const alternarPaga = async () => {
        const novoValor = !paga; // Inverte o valor atual
        try {
            await axios.put(`http://${endereco}:3000/contas/${cod}`, { paga: novoValor });
            setPaga(novoValor); // Atualiza o estado local após sucesso no backend
        } catch (error) {
            console.error("Erro ao atualizar conta:", error.message);
        }
        if (paga) {
            Swal.fire("conta marcada como não paga!")
        } else if (!paga) {
            Swal.fire("conta marcada como paga!")
        }

    };

    const abrirModalEdicao = () => {
        setModalAberto(true);
        console.log(formatOptions(anos));
        console.log(formatOptions(meses));
        console.log(formatOptions(tipos));
    };

    const fecharModal = () => {
        setModalAberto(false);
    };

    const handleChange = (selectedOption, actionMeta) => {
        setContaEditada({ ...contaEditada, [actionMeta.name]: selectedOption });
    };

    const salvarEdicao = async () => {
        try {
            await axios.put(`http://${endereco}:3000/editarContas/${cod}`, {
                ...contaEditada,
                tipo: contaEditada.tipo?.value || "",
                mes: contaEditada.mes?.value || "",
                ano: contaEditada.ano?.value || ""
            });
            Swal.fire("Conta atualizada com sucesso!", "", "success");
            fecharModal();
        } catch (error) {
            console.error("Erro ao editar conta:", error.message);
            Swal.fire("Erro ao editar a conta.", "", "error");
        }
    };

    const formatOptions = (data) =>
        data.map((item) => ({ value: item.cod, label: item.descricao }));


    return (
        <div className={`${paga ? styles.contaPaga : styles.contaCard}`}>
            <strong>Nome:</strong> {nome} <br />
            <strong>Tipo:</strong> {tipo} <br />
            <strong>Mês:</strong> {mes} <br />
            <strong>Ano:</strong> {ano} <br />
            <strong>Valor:</strong> R$ {valor.toFixed(2)} <br />
            <strong>Paga:</strong> {paga ? "Sim" : "Não"} <br />
            <button className={`${paga ? styles.btnPago : styles.btn}`}
                onClick={alternarPaga}
                style={{
                    padding: "5px 10px",
                    backgroundColor: paga ? "#18401b" : "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {paga ? "Marcar como Não Paga" : "Marcar como Paga"}
            </button>

            <button onClick={() => excluirConta(cod)} className={styles.btn} style={{ backgroundColor: "#f44336" }}>
                Excluir
            </button>
            <br />
            <button onClick={abrirModalEdicao} className={styles.btn}>Editar</button>
            {modalAberto && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Editar Conta</h2>
                        <label>Nome:</label>
                        <input type="text" name="nome" value={contaEditada.nome} onChange={(e) => setContaEditada({ ...contaEditada, nome: e.target.value })} />

                        <label>Tipo:</label>
                        <Select name="tipo" value={contaEditada.tipo} onChange={handleChange} options={formatOptions(tipos)} placeholder="Selecione o tipo" />

                        <label>Mês:</label>
                        <Select name="mes" value={contaEditada.mes} onChange={handleChange} options={formatOptions(meses)} placeholder="Selecione o mês" />

                        <label>Ano:</label>
                        <Select name="ano" value={contaEditada.ano} onChange={handleChange} options={formatOptions(anos)} placeholder="Selecione o ano" />

                        <label>Valor:</label>
                        <input type="number" name="valor" value={contaEditada.valor} onChange={(e) => setContaEditada({ ...contaEditada, valor: e.target.value })} />

                        <div className={styles.modalButtons}>
                            <Button onClick={salvarEdicao} variant="contained" color="success">Salvar</Button>
                            <Button onClick={fecharModal} variant="contained" color="secondary">Cancelar</Button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Conta;
