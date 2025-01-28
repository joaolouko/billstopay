import { useState } from "react";
import axios from "axios";
import styles from './Conta.module.css'
import Swal from "sweetalert2";

function Conta({cod, nome, tipo, mes, ano, valor, paga: inicialPaga }) {
    const [paga, setPaga] = useState(inicialPaga);
    

    const alternarPaga = async () => {
        const novoValor = !paga; // Inverte o valor atual
        try {
            await axios.put(`http://localhost:3000/contas/${cod}`, { paga: novoValor });
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
    return (
        <div className={`${
            paga ? styles.contaPaga : styles.contaCard
        }`}>
            <strong>Nome:</strong> {nome} <br />
            <strong>Tipo:</strong> {tipo} <br />
            <strong>Mês:</strong> {mes} <br />
            <strong>Ano:</strong> {ano} <br />
            <strong>Valor:</strong> R$ {valor.toFixed(2)} <br />
            <strong>Paga:</strong> {paga ? "Sim" : "Não"} <br />
            <button className={styles.btn}
                onClick={alternarPaga}
                style={{
                    padding: "5px 10px",
                    backgroundColor: paga ? "#f44336" : "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {paga ? "Marcar como Não Paga" : "Marcar como Paga"}
            </button>
        </div>
    );
}

export default Conta;
