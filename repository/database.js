const mysql = require("mysql2");

class Database {
    #connection;

    constructor() {
        this.#connection = mysql.createPool({
            host: "localhost",
            user: "root",
            password: "",
            database: "colorpaint",
        }).promise();
    }

    async verifyLogin(email, password) {
        try {
            console.log('Verificando login no banco de dados');
            const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
            const [rows, fields] = await this.#connection.execute(sql, [email, password]);
            console.log('Resultado da consulta:', rows);
            return rows;
        } catch (error) {
            console.error('Erro ao verificar login no banco de dados:', error);
            throw error;
        }
    }

    async registerUser(username, email, password) {
        try {
            const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
            const [result] = await this.#connection.execute(sql, [username, email, password]);
            return result;
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            throw error;
        }
    }

    async getUserDrawings(userId) {
        try {
            const sql = 'SELECT * FROM desenhos WHERE usuarios_user_id = ?';
            const [desenhos, fields] = await this.#connection.execute(sql, [userId]);
            return desenhos;
        } catch (error) {
            console.error('Erro ao recuperar desenhos do usuário:', error);
            throw error;
        }
    }
}

module.exports = Database;
