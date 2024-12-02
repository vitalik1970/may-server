const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Модуль для обработки POST запросов
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Настройка парсинга JSON
app.use(express.json());

// Обработка POST запроса с сообщением
app.post('/send-message', (req, res) => {
    const message = req.body.message; // Получаем сообщение из тела запроса
    console.log('Received message:', message); // Выводим его на сервер

    // Сохраняем сообщение в файл
    fs.appendFile('messages.txt', `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ success: 'Message received and saved' });
    });
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
