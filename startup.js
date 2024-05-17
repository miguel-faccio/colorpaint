const path = require('path');
const bodyParser = require('body-parser');
const express = require("express");
const session = require('express-session');
const Database = require('./repository/database');
const consign = require("consign");

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'mvc/views'));
app.set('views', path.join(__dirname, 'mvc/views/ctrldev')); // Caminho para o diretório de views

// Configuração da sessão
app.use(session({
    secret: 'secret-key', // Você deve usar uma chave secreta segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Deve ser true se estiver usando HTTPS
}));

const db = new Database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './mvc/views/ctrldev')));
app.use(express.static(path.join(__dirname, './mvc/views/public')));

app.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/public/colorpaint/index.html'));
});

app.get("/cadastro", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/public/colorpaint/cadastrar.html'));
});

app.get("/admin", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render("crtldev/painel", { username: req.session.user.username }); // Passando o username para a view
});

app.get("/adm", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/ctrldev/login.html'));
});
app.get("/cadadm", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendFile(path.resolve('mvc/views/ctrldev/casdastrar.html'));
});

app.post('/loginAdm', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
        const result = await db.registerUser(username, email, password);
        if (result.affectedRows > 0) {
            res.redirect('/');
        } else {
            res.redirect('/error');
        }
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.redirect('/error');
    }
});

app.get("/home", (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render("public/colorpaint/canva", { username: req.session.user.username }); // Passando o username para a view
});

app.get('/gallery', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render('public/colorpaint/gallery', { username: req.session.user.username });
});



app.get('/error', function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.render('ctrldev/error.ejs');
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

consign()
    .include("mvc/controllers")
    .into(app);

// Middleware para lidar com erros
app.use((err, req, res, next) => {
    console.error('Middleware de erro:', err.stack);
    res.status(500).render('ctrldev/error');
});

app.listen(3000, () => console.log("Online Server at port 3000"));

module.exports = app;
