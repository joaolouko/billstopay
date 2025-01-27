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

const port = 3000;

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`)
})