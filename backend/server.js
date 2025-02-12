import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD );
console.log("DB_NAME:", process.env.DB_NAME);
console.log("SERVER_IP:", process.env.SERVER_IP);

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

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

app.get('/mes', (req, res) => {
    db.query('select * from mes', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(results);
            console.log(results)
        }
    })
});

app.get('/ano', (req, res) => {
    db.query('select * from ano', (err, results) => {
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
            mes.descricao AS mes,
            tipo.descricao AS tipo,
            ano.descricao AS ano -- Aqui estamos pegando a descrição do ano da tabela 'ano'
        FROM
            contas
        JOIN
            mes
        ON
            contas.mes = mes.cod
        JOIN 
            tipo 
        ON 
            contas.tipo = tipo.cod
        JOIN
            ano
        ON
            contas.ano = ano.cod 
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

app.put("/editarContas/:cod", (req, res) => {
    const { cod } = req.params;
    const { nome, tipo, mes, ano, valor } = req.body;

    console.log("Dados recebidos para edição:", { cod, nome, tipo, mes, ano, valor }); // Debug

    if (!nome || !tipo || !mes || !ano || !valor) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos." });
    }

    const sql = "UPDATE contas SET nome = ?, tipo = ?, mes = ?, ano = ?, valor = ? WHERE cod = ?";
    db.query(sql, [nome, tipo, mes, ano, valor, cod], (err, result) => {
        if (err) {
            console.error("Erro ao editar conta:", err.message);
            return res.status(500).json({ error: "Erro ao editar conta." });
        }
        res.status(200).json({ message: "Conta atualizada com sucesso!" });
    });
})



app.post('/contas', (req, res) => {
    const { nome, tipoConta, valor, paga, mes, ano} = req.body;

    // Validação de campos obrigatórios
    if (!nome || !tipoConta || !valor || !mes || !ano) {
        return res.status(400).json({ 
            error: "Nome, tipo de conta, valor, mês e ano são obrigatórios." 
        });
    }

    const sql = "INSERT INTO contas (nome, tipo, valor, paga, mes, ano) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [nome, tipoConta, valor, paga || false, mes, ano], (err, results) => {
        if (err) {
            console.error("Erro ao inserir no banco:", err.message);
            return res.status(500).json({ 
                error: "Erro ao salvar no banco de dados. Verifique os dados enviados." 
            });
        }

        // Retornando uma mensagem com o ID da nova conta
        res.status(201).json({ 
            message: "Conta cadastrada com sucesso!",
            contaId: results.insertId // ID da conta recém-criada
        });
    });
});

app.delete("/contas/:cod", (req, res) => {
    console.log('Rota DELETE chamada'); // Adicione esse log
    const { cod } = req.params;
    
    // Verifica se o código da conta foi passado
    if (!cod) {
        return res.status(400).json({ error: "Código da conta não fornecido." });
    }

    // Deleta a conta com o código especificado
    const sql = "DELETE FROM contas WHERE cod = ?";
    db.query(sql, [cod], (err, result) => {
        if (err) {
            console.error("Erro ao excluir conta:", err.message);
            return res.status(500).json({ error: "Erro ao excluir conta." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Conta não encontrada." });
        }

        res.status(200).json({ message: "Conta excluída com sucesso!" });
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})
