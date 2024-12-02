const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Включаем CORS
app.use(cors());

// Для обработки JSON в теле запроса
app.use(express.json());

// Указываем Express, где искать статические файлы
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Обработка POST запроса с сообщением
app.post('/send-message', (req, res) => {
    const message = req.body.message;
    console.log('Received message:', message);

    fs.appendFile('messages.txt', `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ success: 'Message received and saved' });
    });
});

// Новый эндпоинт для получения сообщений
app.get('/get-messages', (req, res) => {
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading messages:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const messages = data.split('\n').filter(line => line.trim() !== '');
        res.status(200).json({ messages });
    });
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

