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
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: 'Name and message are required.' });
    }

    const date = new Date().toISOString().split('T')[0]; // Форматируем дату как YYYY-MM-DD
    const logEntry = `${date} - ${username}: ${message}\n`;;

    // Сохраняем сообщение в файл
 fs.appendFile('messages.txt', logEntry, (err) => {
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
 const messages = data
            .trim()
            .split('\n')
            .map((line) => {
                const [dateAndName, message] = line.split(': ');
                const [date, username] = dateAndName.split(' - ');
                return { date, username, message };
            });

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

