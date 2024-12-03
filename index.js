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

// Маршрут для получения сообщений
app.get('/get-messages', (req, res) => {
    fs.readFile('messages.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading messages file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Разбиваем файл на массив строк и отправляем
        const messages = data.split('\n').filter(Boolean);
        res.status(200).json({ messages });
    });
});

// Обслуживание статического приложения Next.js
app.use(express.static(path.join(__dirname, 'public')));

// Перенаправление всех запросов к Next.js приложению, кроме API
app.get('*', (req, res) => {
    const apiRoutes = ['/send-message', '/get-messages'];
    if (!apiRoutes.includes(req.path)) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ error: 'API route not found' });
    }
});

// Запуск сервера
app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

