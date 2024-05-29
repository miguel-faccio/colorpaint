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

    async execute(query, params = []) {
        try {
            const [rows, fields] = await this.#connection.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Erro ao executar consulta:', error);
            throw error;
        }
    }

    async verifyLogin(email, password) {
        try {
            if (email === undefined || password === undefined) {
                throw new Error("Email e password não podem ser undefined.");
            }

            console.log('Verificando login no banco de dados');
            const sql = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
            const rows = await this.execute(sql, [email, password]);
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
            const result = await this.execute(sql, [username, email, password]);
            return result;
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const sql = 'SELECT * FROM usuarios';
            const rows = await this.execute(sql);
            return rows;
        } catch (error) {
            console.error('Erro ao recuperar usuários:', error);
            throw error;
        }
    }

    async getAllDrawings() {
        try {
            const query = `
                SELECT desenhos.drawing_id, desenhos.drawing_name, desenhos.drawing_data, usuarios.username 
                FROM desenhos
                JOIN usuarios ON desenhos.usuarios_user_id = usuarios.user_id
            `;
            const rows = await this.execute(query);
            return rows;
        } catch (error) {
            console.error('Erro ao recuperar desenhos:', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const sql = 'SELECT * FROM usuarios WHERE user_id = ?';
            const rows = await this.execute(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar usuário pelo ID:', error);
            throw error;
        }
    }

    async getUserDrawings(userId) {
        try {
            const sql = 'SELECT drawing_id, drawing_name, drawing_data FROM desenhos WHERE usuarios_user_id = ?';
            const rows = await this.execute(sql, [userId]);
            return rows;
        } catch (error) {
            console.error('Erro ao recuperar desenhos do usuário:', error);
            throw error;
        }
    }
    

    async updateUser(id, username, email, password) {
        try {
            const sql = 'UPDATE usuarios SET username = ?, email = ?, password = ? WHERE user_id = ?'; // Ajuste user_id
            const result = await this.execute(sql, [username, email, password, id]);
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
    
            // Obter desenhos associados ao usuário selecionado
            const drawings = await this.getUserDrawings(userId);
    
            // Excluir os desenhos associados ao usuário
            for (const drawing of drawings) {
                await this.deleteDrawing(drawing.drawing_id);
            }
    
            // Excluir o usuário após excluir os desenhos
            const sql = 'DELETE FROM usuarios WHERE user_id = ?';
            const result = await this.execute(sql, [userId]);
            return result;
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            throw error;
        }
    }

    async deleteDrawing(id) {
        try {
            const sql = 'DELETE FROM desenhos WHERE drawing_id = ?';
            const result = await this.execute(sql, [id]);
            return result;
        } catch (error) {
            console.error('Erro ao excluir desenho:', error);
            throw error;
        }
    }
    async saveDrawing(drawingname, data, user_id) {
        if (drawingname === undefined || data === undefined || user_id === undefined) {
            throw new Error('Undefined parameter(s) provided to saveDrawing');
        }

        try {
            const sql = 'INSERT INTO desenhos (drawing_name, drawing_data, usuarios_user_id) VALUES (?, ?, ?)';
            const result = await this.execute(sql, [drawingname, data, user_id]);
            return result;
        } catch (error) {
            console.error('Erro ao salvar desenho:', error);
            throw error;
        }
    }
    
    
}

module.exports = Database;
