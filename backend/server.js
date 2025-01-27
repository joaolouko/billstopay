const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Petereval123@',
    database: 'bills',
})

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados!');
    }
});

app.get('/tipo', (req, res) => {
    db.query('select * from tipo', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
            console.log(results)
        }
    })
})

app.get("/contas", (req, res) => {
    const sql = `
        SELECT 
            contas.cod, 
            contas.nome, 
            contas.valor, 
            contas.paga, 
            tipo.descricao AS tipo
        FROM 
            contas
        JOIN 
            tipo 
        ON 
            contas.tipo = tipo.cod
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar contas:", err.message);
            return res.status(500).json({ error: "Erro ao buscar contas." });
        }
        res.status(200).json(results);
    });
});

app.put("/contas/:cod", (req, res) => {
    const { cod } = req.params;
    const { paga } = req.body;

    console.log("Dados recebidos:", { cod, paga }); // Debug
    if (typeof paga !== "boolean") {
        return res.status(400).json({ error: "O campo 'paga' deve ser um valor booleano." });
    }

    const sql = "UPDATE contas SET paga = ? WHERE cod = ?";
    db.query(sql, [paga, cod], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar conta:", err.message);
            return res.status(500).json({ error: "Erro ao atualizar conta." });
        }
        res.status(200).json({ message: "Conta atualizada com sucesso!" });
    });
});

app.post('/contas', (req, res) => {
    const {nome, tipoConta, valor, paga} = req.body;

    if (!nome || !tipoConta || !valor) {
        return res.status(400).json({ error: "Nome, tipo de conta e valor são obrigatórios" });
    }

    const sql = "INSERT INTO contas (nome, tipo, valor, paga) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, tipoConta, valor, paga], (err, results) => {
        if (err) {
            console.error("Erro ao inserir no banco:", err.message);
            return res.status(500).json({ error: "Erro ao salvar no banco de dados" });
        }
        res.status(201).json({ message: "Conta cadastrada com sucesso!" });
    });
})

const port = 3000;

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})