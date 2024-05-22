const path = require('path');
const bodyParser = require('body-parser');
const express = require("express");
const session = require('express-session');
const Database = require('./repository/database');
const consign = require("consign");

const app = express();
const db = new Database();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'mvc', 'views'));

// Configuração da sessão
app.use(session({
    secret: 'secret-key', // Use uma chave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'mvc/views/public')));
app.use(express.static(path.join(__dirname, 'mvc/views/ctrldev')));

// Rotas Públicas
app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/public/colorpaint/index.html'));
});

app.get("/cadastro", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/public/colorpaint/cadastrar.html'));
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validação de entrada
    if (!email || !password) {
        console.log('Email e password são obrigatórios');
        return res.status(400).redirect('/');
    }

    try {
        console.log(`Tentativa de login com email: ${email}`);
        const result = await db.verifyLogin(email, password);
        console.log('Resultado da verificação de login:', result);

        if (result.length > 0) {
            req.session.user = {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email
            };
            console.log('Usuário logado:', req.session.user);
            return res.redirect('/home');
        } else {
            console.log('Nenhum usuário encontrado com essas credenciais.');
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        return res.redirect('/error');
    }
});

// Rota de Registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validação de entrada
    if (!username || !email || !password) {
        console.log('Todos os campos são obrigatórios');
        return res.status(400).redirect('/cadastro');
    }

    try {
        const result = await db.registerUser(username, email, password);
        if (result.affectedRows > 0) {
            return res.redirect('/');
        } else {
            return res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.redirect('/error');
    }
});

// Rotas Administrativas
app.get("/admin", async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    try {
        const usuarios = await db.getAllUsers();
        const desenhos = await db.getAllDrawings();
        res.render("ctrldev/painel", { username: req.session.user.username, usuarios, desenhos });
    } catch (error) {
        console.error('Erro ao carregar painel administrativo:', error);
        res.redirect('/error');
    }
});

app.get("/adm", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/ctrldev/login.html'));
});

app.get("/cadadm", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/ctrldev/cadastrar.html'));
});

app.post('/loginadm', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    try {
        console.log(`Tentativa de login com email: ${email}`);
        const result = await db.verifyLogin(email, password);
        console.log('Resultado da verificação de login:', result);
        if (result.length > 0) {
            req.session.user = {
                id: result[0].id,
                username: result[0].username,
                email: result[0].email
            };
            console.log('Usuário logado:', req.session.user);
            return res.redirect('/admin');
        } else {
            console.log('Nenhum usuário encontrado com essas credenciais.');
            return res.redirect('/adm');
        }
    } catch (error) {
        console.error('Erro ao verificar o login:', error);
        return res.redirect('/error');
    }
});

app.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render("public/colorpaint/canva", { username: req.session.user.username });
});

app.get('/gallery', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render('public/colorpaint/gallery', { username: req.session.user.username });
});

app.get('/error', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render('ctrldev/error');
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/error');
        }
        res.redirect('/');
    });
});

// Rota para exibir a página de edição de usuário
app.get('/edit-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await db.getUserById(id);
        res.render('ctrldev/editarUser', { usuario });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.redirect('/error');
    }
});

// Rota para atualizar os dados do usuário
app.post('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        await db.updateUser(id, username, email, password);
        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.redirect('/error');
    }
});

// Rota para excluir usuário
app.delete("/user/:id", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        const userId = req.params.id;

        // Obter desenhos associados ao usuário selecionado
        const drawings = await db.getUserDrawings(userId);

        // Excluir os desenhos associados ao usuário
        for (const drawing of drawings) {
            await db.deleteDrawing(drawing.id);
        }

        // Excluir o usuário após excluir os desenhos
        const status = await db.deleteUser(userId);

        res.json({
            status
        });
    } catch (error) {
        // Capturar e lidar com erros
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({
            error: error.message
        });
    }
});


// Rota para excluir desenho
app.delete('/drawing/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const result = await db.deleteDrawing(req.params.id);
        res.json({ status: result.affectedRows > 0 ? 'success' : 'error' });
    } catch (error) {
        console.error('Erro ao excluir desenho:', error);
        res.json({ status: 'error' });
    }
});

consign()
    .include("mvc/controllers")
    .into(app);

// Middleware para lidar com erros
app.use((err, req, res, next) => {
    console.error('Middleware de erro:', err.stack);
    res.status(500).render('ctrldev/error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app;
