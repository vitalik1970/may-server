const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Включаем CORS
app.use(cors());

// Обработка JSON в теле запроса
app.use(express.json());

// Маршрут для отправки сообщений
app.post('/send-message', (req, res) => {
    const message = req.body.message;
    console.log('Received message:', message);

    // Сохраняем сообщение в файл
    fs.appendFile('messages.txt', `${new Date().toISOString()} - ${message}\n`, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ success: 'Message received and saved' });
    });
});

// Обслуживание статического приложения Next.js
app.use(express.static(path.join(__dirname, 'public')));

// Перенаправление всех запросов к Next.js приложению
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
