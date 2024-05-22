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
            if (email === undefined || password === undefined) {
                throw new Error("Email e password não podem ser undefined.");
            }

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
            if (username === undefined || email === undefined || password === undefined) {
                throw new Error("Username, email e password não podem ser undefined.");
            }

            const sql = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
            const [result] = await this.#connection.execute(sql, [username, email, password]);
            return result;
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            const sql = 'SELECT * FROM usuarios';
            const [rows, fields] = await this.#connection.execute(sql);
            return rows;
        } catch (error) {
            console.error('Erro ao recuperar usuários:', error);
            throw error;
        }
    }

    async getAllDrawings() {
        try {
            const sql = 'SELECT * FROM desenhos';
            const [rows, fields] = await this.#connection.execute(sql);
            return rows;
        } catch (error) {
            console.error('Erro ao recuperar desenhos:', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE user_id = ?';
            const [rows, fields] = await this.#connection.execute(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar usuário pelo ID:', error);
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

    async updateUser(id, username, email, password) {
        try {
            const sql = 'UPDATE usuarios SET username = ?, email = ?, password = ? WHERE id = ?';
            const [result] = await this.#connection.execute(sql, [username, email, password, id]);
            return result;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            if (userId === undefined) {
                throw new Error("User ID não pode ser undefined.");
            }
    
            const sql = 'DELETE FROM usuarios WHERE user_id = ?'; // Ajuste aqui para usar user_id
            const [result] = await this.#connection.execute(sql, [userId]);
            return result;
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }


    async deleteDrawing(id) {
        try {
            const sql = 'DELETE FROM desenhos WHERE id = ?';
            const [result] = await this.#connection.execute(sql, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao excluir desenho:', error);
            throw error;
        }
    }
}

module.exports = Database;            
