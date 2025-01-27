import { useState } from "react";
import axios from "axios";

function Conta({cod, nome, tipo, valor, paga: inicialPaga }) {
    const [paga, setPaga] = useState(inicialPaga);

    const alternarPaga = async () => {
        const novoValor = !paga; // Inverte o valor atual
        try {
            await axios.put(`http://localhost:3000/contas/${cod}`, { paga: novoValor });
            setPaga(novoValor); // Atualiza o estado local após sucesso no backend
        } catch (error) {
            console.error("Erro ao atualizar conta:", error.message);
        }
    };
    return (
        <div className="conta-card" style={{ border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "8px" }}>
            <strong>Nome:</strong> {nome} <br />
            <strong>Tipo:</strong> {tipo} <br />
            <strong>Valor:</strong> R$ {valor.toFixed(2)} <br />
            <strong>Paga:</strong> {paga ? "Sim" : "Não"} <br />
            <button
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
