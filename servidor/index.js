const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'aulabd'
});

// Conectando ao banco de dados
db.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro);
    } else {
        console.log('Conectando ao MySQL com sucesso!');
    }
});

// Rota para consultar todos os usúarios
app.get('/alunos', (req, res) => {
    const sql = 'SELECT * FROM alunos';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar alunos'});
        }

        if (results.length ===0) {
            console.error('Usuário não encontrado:', err);
            return res.status(404).json({ error: 'Usuário não encontrado'});
        }
        res.json(results);
    });
});

app.post('/alunos', (req, res) => {
    const { nome, cidade, estado } = req.body;

    const sql = 'INSERT INTO alunos(nome, cidade, estado) VALUE (?,?,?)';

    db.query(sql, [nome, cidade, estado], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário'});
        }
        res.json({ message: 'Aluno cadastrado com sucesso!' });
    });
});

app.put('/alunos/:codigo', (req, res) => {
    const { codigo } = req.params;
    const { nome, cidade, estado } = req.body;

    const sql = 'UPDATE alunos SET nome = ?, cidade = ?, estado = ? WHERE codigo = ?';

    db.query(sql, [nome, cidade, estado, codigo], (err) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar usuário'});
        }
        res.json({ message: 'Aluno atualizado com sucesso!' });
    });
});

app.delete('/alunos/:codigo', (req, res) => {
    const { codigo } = req.params;
    const sql = 'DELETE FROM alunos WHERE codigo = ?';

    db.query(sql, [codigo], (err) => {
        if (err) {
            return res.status(500).json({ eror: 'Erro ao excluir aluno'});
        }
        res.json({ message: 'Aluno excluído com sucesso!' });
    });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});