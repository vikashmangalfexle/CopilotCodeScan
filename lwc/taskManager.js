const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
app.use(express.json());

// Hardcoded Secrets - Security Risk
const DB_USER = 'admin';
const DB_PASSWORD = 'password123';
const API_KEY = 'sk_test_1234567890abcdef';

// SQL Injection Risk - Accepting raw user input in query
app.get('/users', (req, res) => {
    let userId = req.query.id;
    let query =  `SELECT * FROM users WHERE id = '${userId}'`; // SQL Injection risk

    const connection = mysql.createConnection({
        host: 'localhost',
        user: DB_USER,
        password: DB_PASSWORD,
        database: 'testdb'
    });

    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Database error');
        } else {
            res.json(results);
        }
    });

    connection.end();
});

// Insecure API Call - No TLS validation
app.get('/external-api', async (req, res) => {
    try {
        let response = await axios.get(`http://example.com/data`, {  // Uses HTTP instead of HTTPS
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Hardcoded JWT Secret - Security Risk
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';

app.post('/login', (req, res) => {
    let token = jwt.sign({ user: req.body.username }, SECRET_KEY);  // Hardcoded secret key
    res.json({ token });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});